import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateAttendanceDto,
  QrGeneralCode,
} from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Class } from 'src/classes/entities/class.entity';
import isoWeek from 'dayjs/plugin/isoWeek'; // Plugin để xử lý tuần bắt đầu từ thứ Hai
import { Score } from 'src/score/entities/score.entity';
import { ScoreService } from 'src/score/score.service';
import * as QRCode from 'qrcode';
import { IUser } from 'src/helpers/types/user.interface';
import duration from 'dayjs/plugin/duration';
import { formatToHHMMSS } from 'src/helpers/func/formatTime';
dayjs.extend(duration);
dayjs.extend(isoWeek);
@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  async create() {
    const today = dayjs().startOf('day');
    const startOfWeek = today.startOf('isoWeek');
    const endOfWeek = today.endOf('isoWeek');

    const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
      startOfWeek.add(i, 'day'),
    );

    // Lấy tất cả các lịch hợp lệ trong tuần
    const schedules = await this.scheduleRepository.find({
      where: {
        startDate: LessThanOrEqual(endOfWeek.toDate()),
        endDate: MoreThanOrEqual(startOfWeek.toDate()),
      },
      relations: ['class.students'],
    });

    if (!schedules || schedules.length === 0) {
      throw new NotFoundException(`Không có lịch học nào trong tuần này.`);
    }

    const attendancesToCreate = [];

    for (const day of daysOfWeek) {
      const dayName = day.format('dddd'); // Lấy tên của ngày (ví dụ: Monday, Tuesday)

      for (const schedule of schedules) {
        if (
          schedule.daysOfWeek
            .flatMap((dayOfWeek) => dayOfWeek.name)
            .includes(dayName)
        ) {
          for (const student of schedule.class.students) {
            const existingAttendance = await this.attendanceRepository.findOne({
              where: {
                date: day.toDate(),
                student: { id: student.id },
                schedule: { id: schedule.id },
              },
            });

            if (!existingAttendance) {
              const newAttendance = this.attendanceRepository.create({
                date: day.toDate(),
                student,
                schedule,
              });

              attendancesToCreate.push(newAttendance);
            }
          }
        }
      }
    }

    if (attendancesToCreate.length > 0) {
      console.log('Call >>>>: Tạo lịch cho cả tuần thành công');
      return await this.attendanceRepository.save(attendancesToCreate);
    } else {
      // throw new BadRequestException('Lịch điểm danh đã có rồi');
      console.log('Lịch điểm danh cho cả tuần đã được tạo trước đó.');
    }
  }

  async findAll() {
    return await this.attendanceRepository.findOne({
      where: {
        date: new Date(),
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} attendance`;
  }

  // async updateAttendance(
  //   scheduleId: number,
  //   date: Date,
  //   updateAttendanceDto: UpdateAttendanceDto,
  // ) {
  //   const { students } = updateAttendanceDto;

  //   const updates = students.map(async ({ studentId, isPresent }) => {
  //     const attendance = await this.attendanceRepository.findOne({
  //       where: {
  //         student: { id: studentId },
  //         schedule: { id: scheduleId },
  //         date: date,
  //       },
  //     });

  //     if (attendance) {
  //       attendance.isPresent = isPresent;
  //       return this.attendanceRepository.save(attendance);
  //     } else {
  //       throw new BadRequestException(`Student with ID ${studentId} not found.`);
  //     }
  //   });

  //   return Promise.all(updates);
  // }

  async updateAttendance(
    scheduleId: number,
    date: Date,
    updateAttendanceDto: UpdateAttendanceDto,
  ) {
    const { students } = updateAttendanceDto;

    // Tính tổng số buổi học duy nhất
    const totalSessionsResult = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .select('COUNT(DISTINCT attendance.date)', 'count')
      .where('attendance.scheduleId = :scheduleId', { scheduleId })
      .getRawOne();

    const totalSessions = parseInt(totalSessionsResult.count, 10);

    if (totalSessions <= 0) {
      throw new BadRequestException(
        `No sessions found for Schedule ID ${scheduleId}`,
      );
    }

    const updates = students.map(async ({ studentId, isPresent }) => {
      const attendance = await this.attendanceRepository.findOne({
        where: {
          student: { id: studentId },
          schedule: { id: scheduleId },
          date: date,
        },
      });

      if (attendance) {
        attendance.isPresent = isPresent;
        await this.attendanceRepository.save(attendance);

        // Tính số buổi đã tham gia
        const attendedSessionsResult = await this.attendanceRepository
          .createQueryBuilder('attendance')
          .select('COUNT(attendance.id)', 'count')
          .where('attendance.studentId = :studentId', { studentId })
          .andWhere('attendance.scheduleId = :scheduleId', { scheduleId })
          .andWhere('attendance.isPresent = :isPresent', { isPresent: true })
          .getRawOne();

        const attendedSessions = parseInt(attendedSessionsResult.count, 10);

        // Cập nhật điểm chuyên cần
        const maxAttendancePoints = 10;
        const attendanceScore =
          (attendedSessions / totalSessions) * maxAttendancePoints;

        const score = await this.scoreRepository.findOne({
          where: {
            student: { id: studentId },
            semester: { schedules: { id: attendance.schedule.id } },
          },
        });

        if (score) {
          score.attendanceScore = Number(attendanceScore.toFixed(2));
          await this.scoreRepository.save(score);
        } else {
          throw new BadRequestException(
            `Score record not found for Student ID ${studentId}`,
          );
        }
      } else {
        throw new BadRequestException(
          `Attendance record not found for Student ID ${studentId}`,
        );
      }
    });

    return Promise.all(updates);
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }

  generateDatesForSchedule(
    startDate: Date,
    endDate: Date,
    daysOfWeek: string[],
  ): Date[] {
    const dates = [];
    let currentDate = dayjs(startDate);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      if (daysOfWeek.includes(currentDate.format('dddd'))) {
        dates.push(currentDate.toDate());
      }
      currentDate = currentDate.add(1, 'day');
    }

    return dates;
  }

  async getAttendanceByDate(scheduleId: number, date: Date) {
    return this.attendanceRepository.find({
      where: {
        schedule: { id: scheduleId },
        date: date,
      },
      relations: ['student', 'schedule'],
    });
  }

  async createAttendanceBySchedule(createAttendanceDto: CreateAttendanceDto) {
    // Lấy lịch cụ thể theo ID
    const schedule = await this.scheduleRepository.findOne({
      where: { id: createAttendanceDto.scheduleId },
      relations: [
        'class',
        'class.students',
        'daysOfWeek',
        'subject',
        'semester',
      ],
    });

    if (!schedule) {
      throw new NotFoundException('Lịch học không tồn tại.');
    }

    const { startDate, endDate, daysOfWeek, class: classData } = schedule;

    if (!classData || classData.students.length === 0) {
      throw new NotFoundException('Không có học sinh nào trong lớp.');
    }

    let currentDay = dayjs(startDate).startOf('day');
    const endDay = dayjs(endDate).endOf('day');

    const attendancesToCreate = [];
    const scoresToCreate = [];

    while (currentDay.isBefore(endDay) || currentDay.isSame(endDay)) {
      const dayName = currentDay.format('dddd');
      // Kiểm tra xem ngày hiện tại có nằm trong danh sách daysOfWeek không
      if (daysOfWeek.flatMap((dayOfWeek) => dayOfWeek.name).includes(dayName)) {
        for (const student of classData.students) {
          // Kiểm tra xem điểm danh đã tồn tại chưa
          const existingAttendance = await this.attendanceRepository.findOne({
            where: {
              date: currentDay.toDate(),
              student: { id: student.id },
              schedule: { id: createAttendanceDto.scheduleId },
            },
          });

          if (!existingAttendance) {
            // Tạo bản ghi điểm danh mới
            const newAttendance = this.attendanceRepository.create({
              date: currentDay.toDate(),
              student,
              schedule,
            });

            attendancesToCreate.push(newAttendance);
          }
          // Tạo bản ghi điểm mới nếu chưa tồn tại
          const existingScore = await this.scoreRepository.findOne({
            where: {
              student: { id: student.id },
              subject: { id: schedule.subject.id },
              semester: { id: schedule.semester.id },
            },
          });

          if (!existingScore) {
            const newScore = this.scoreRepository.create({
              student,
              subject: schedule.subject,
              semester: schedule.semester,
            });

            const existsInScores = scoresToCreate.some(
              (score) =>
                score.student.id === newScore.student.id &&
                score.subject.id === newScore.subject.id,
            );

            if (!existsInScores) {
              scoresToCreate.push(newScore);
            }
          }
        }
      }

      // Tăng ngày lên 1 (Gán lại giá trị cho currentDay)
      currentDay = currentDay.add(1, 'day');
    }

    if (scoresToCreate.length > 0) {
      await this.scoreRepository.save(scoresToCreate);
    }

    if (attendancesToCreate.length > 0) {
      console.log('Tạo điểm danh theo lịch thành công.');
      return await this.attendanceRepository.save(attendancesToCreate);
    } else {
      console.log('Tất cả điểm danh đã được tạo trước đó.');
      throw new BadRequestException(
        `Schedule có ID ${schedule.id} đã được tạo `,
      );
    }
  }

  async generateQRCode(data: QrGeneralCode) {
    try {
      const jsonData = JSON.stringify(data);

      return await QRCode.toDataURL(jsonData); // Tạo base64
    } catch (error) {
      throw new Error('Error generating QR Code');
    }
  }

  async scanQRAttendanceStudent(qrData: string, user: IUser) {
    const { scheduleId, date } = JSON.parse(qrData);
    // Tính tổng số buổi học duy nhất
    const totalSessionsResult = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .select('COUNT(DISTINCT attendance.date)', 'count')
      .where('attendance.scheduleId = :scheduleId', { scheduleId })
      .getRawOne();

    const totalSessions = parseInt(totalSessionsResult.count, 10);

    if (totalSessions <= 0) {
      throw new BadRequestException(
        `No sessions found for Schedule ID ${scheduleId}`,
      );
    }
    const attendance = await this.attendanceRepository.findOne({
      where: {
        date: date,
        schedule: { id: scheduleId },
        student: { id: user.id },
      },
      relations: ['schedule'],
    });
    console.log(attendance);
    if (!attendance) {
      throw new BadRequestException('Attendance không tồn tại.');
    }

    if (attendance.isPresent === true) {
      throw new BadRequestException('Attendance đã được điểm danh trước đó.');
    }

    // const now = dayjs(); // Thời gian hiện tại
    // const currentTime = dayjs(now.format('HH:mm:ss'), 'HH:mm:ss');
    // const startTime = formatToHHMMSS(attendance.schedule.startTime);
    // const endTime = formatToHHMMSS(attendance.schedule.endTime);

    // if (currentTime.isBefore(startTime) || currentTime.isAfter(endTime)) {
    //   const errorMessage = currentTime.isBefore(startTime)
    //     ? 'Chưa đến giờ điểm danh.'
    //     : 'Đã quá giờ điểm danh.';
    //   console.log(errorMessage);
    //   throw new BadRequestException(errorMessage);
    // }

    attendance.isPresent = true;

    await this.attendanceRepository.save(attendance);

    // Tính số buổi đã tham gia
        const attendedSessionsResult = await this.attendanceRepository
          .createQueryBuilder('attendance')
          .select('COUNT(attendance.id)', 'count')
          .where('attendance.studentId = :studentId', { studentId: user.id })
          .andWhere('attendance.scheduleId = :scheduleId', { scheduleId })
          .andWhere('attendance.isPresent = :isPresent', { isPresent: true })
          .getRawOne();

        const attendedSessions = parseInt(attendedSessionsResult.count, 10);

        // Cập nhật điểm chuyên cần
        const maxAttendancePoints = 10;
        const attendanceScore =
          (attendedSessions / totalSessions) * maxAttendancePoints;

        const score = await this.scoreRepository.findOne({
          where: { student: { id: user.id }, semester:{schedules:{id: attendance.schedule.id}} },
        });

        if (score) {
          score.attendanceScore = Number(attendanceScore.toFixed(2));
          await this.scoreRepository.save(score);
        } else {
          throw new BadRequestException(
            `Score record not found for Student ID ${user.id}`,
          );
        }

    return { message: 'Điểm danh thành công.' };
  }
}
