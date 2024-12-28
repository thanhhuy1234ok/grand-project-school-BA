import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { DayOfWeek } from 'src/day-of-week/entities/day-of-week.entity';
import aqp from 'api-query-params';
import { User } from 'src/users/entities/user.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { Room } from 'src/room/entities/room.entity';
import dayjs from 'dayjs';
import { IUser } from 'src/helpers/types/user.interface';
import { Semester } from 'src/semester/entities/semester.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(DayOfWeek)
    private readonly dayOfWeekRepository: Repository<DayOfWeek>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
  ) {}
  async create(createScheduleDto: CreateScheduleDto) {
    const {
      teacherId,
      subjectId,
      classId,
      dayOfWeek,
      semesterId,
      ...scheduleData
    } = createScheduleDto;

    const teacher = await this.userRepository.findOne({
      where: { id: teacherId, role: { name: 'TEACHER' } },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    const semester = await this.semesterRepository.findOne({
      where: { id: semesterId },
    });
    if (!semester) {
      throw new NotFoundException(`Semester with ID ${subjectId} not found`);
    }

    const daysOfWeek = await this.dayOfWeekRepository.findByIds(dayOfWeek);
    const invalidDayIds = dayOfWeek.filter(
      (id) => !daysOfWeek.some((day) => day.id === id),
    );
    if (invalidDayIds.length) {
      throw new BadRequestException(
        `Invalid day IDs: ${invalidDayIds.join(', ')}`,
      );
    }

    // Lấy lớp học
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    const room = await this.roomRepository.findOne({
      where: { id: createScheduleDto.room },
    });
    if (!room) {
      throw new NotFoundException(
        `Room with ID ${createScheduleDto.room} not found`,
      );
    }

    const conflictingSchedule = await this.scheduleRepository.findOne({
      where: [
        {
          teacher: { id: teacherId },
          daysOfWeek: daysOfWeek,
          startTime: Between(scheduleData.startTime, scheduleData.endTime),
          endTime: Between(scheduleData.startTime, scheduleData.endTime),
        },
        {
          room: { id: room.id },
          daysOfWeek: daysOfWeek,
          startTime: Between(scheduleData.startTime, scheduleData.endTime),
          endTime: Between(scheduleData.startTime, scheduleData.endTime),
        },
        {
          class: { id: classId },
          daysOfWeek: daysOfWeek,
          startTime: Between(scheduleData.startTime, scheduleData.endTime),
          endTime: Between(scheduleData.startTime, scheduleData.endTime),
        },
        {
          class: { id: classId },
          subject: { id: subjectId },
          daysOfWeek: daysOfWeek,
          semester: { id: semesterId },
        },
      ],
      relations: ['class', 'semester', 'subject', 'teacher', 'room'],
    });

    if (conflictingSchedule) {
      if (conflictingSchedule.teacher?.id === teacherId) {
        throw new ConflictException('Giáo viên đã có lịch vào thời gian này.');
      }

      if (conflictingSchedule.room?.id === scheduleData.room) {
        throw new ConflictException(
          'Phòng đã được sử dụng trong thời gian này.',
        );
      }

      if (
        conflictingSchedule.class?.id === classId &&
        conflictingSchedule.subject?.id === subjectId &&
        conflictingSchedule.semester?.id === semesterId
      ) {
        throw new ConflictException(
          `Lớp đã có lịch học môn ở học kỳ ở ${semester.name}.`,
        );
      }

      if (conflictingSchedule.class?.id === classId) {
        throw new ConflictException('Lớp đã có lịch vào thời gian này.');
      }
    }

    // Tạo lịch học
    const newSchedule = this.scheduleRepository.create({
      ...scheduleData,
      teacher: teacher,
      subject: subject,
      daysOfWeek: daysOfWeek,
      class: classEntity,
      room,
      semester: semester,
    });

    return this.scheduleRepository.save(newSchedule);
  }

  async findAll(currentPage: number, limit: number, qs: string): Promise<any> {
    const { filter, sort } = aqp(qs); // Phân tích query string với aqp

    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;

    const whereCondition = [];
    if (filter.name) {
      whereCondition.push({ name: ILike(`%${filter.name}%`) });
    }

    const where = whereCondition.length ? whereCondition : filter;

    let order = {};
    if (sort) {
      const [sortBy, sortOrder] = Object.entries(sort)[0];
      order = { [sortBy]: sortOrder === 1 ? 'ASC' : 'DESC' };
    }

    const totalItems = await this.scheduleRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    // Truy vấn dữ liệu với phân trang
    const result = await this.scheduleRepository.find({
      where: whereCondition,
      relations: ['subject', 'teacher', 'daysOfWeek', 'class'],
      skip: offset,
      take: defaultLimit,
      order: { id: 'ASC' },
    });

    // Trả về kết quả cùng thông tin phân trang
    return {
      meta: {
        current: currentPage, // Trang hiện tại
        pageSize: defaultLimit, // Số bản ghi mỗi trang
        pages: totalPages, // Tổng số trang
        total: totalItems, // Tổng số bản ghi
      },
      result, // Kết quả truy vấn
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }

  async getTodaySchedules(user: IUser, date: string) {
    try {
      const today = date ? dayjs(date).toDate() : dayjs().toDate();
      const todayWeekday = dayjs(today).format('dddd');

      const schedules = await this.scheduleRepository.find({
        where: {
          startDate: LessThanOrEqual(today),
          endDate: MoreThanOrEqual(today),
          daysOfWeek: { name: todayWeekday }, // Ensure this matches the database format
          teacher: { id: user.id }, // Relation must be configured correctly
        },
        order: {
          startTime: 'ASC',
        },
        relations: ['teacher', 'subject', 'class', 'room'],
      });

      return schedules;
    } catch (error) {
      console.error("Error fetching today's schedules:", error);
      throw new BadRequestException(
        'Could not fetch schedules. Please try again.',
      );
    }
  }

  async findAllSchedulesTeacher(user: IUser) {
    try {
      const schedules = await this.scheduleRepository.find({
        where: {
          teacher: { id: user.id },
        },
        relations: ['subject', 'class', 'daysOfWeek', 'room'],
      });
      return schedules;
    } catch (error) {
      console.error('Error fetching all schedules of teacher:', error);
      throw new Error('Could not fetch schedules. Please try again.');
    }
  }

  async findScheduleStudent(user: IUser) {
    try {
      const schedules = await this.scheduleRepository.find({
        where: {
          class: { students: { id: user.id } },
        },
        order: { startTime: 'ASC' },
        relations: ['subject', 'room', 'teacher', 'daysOfWeek', 'class'],
      });
      return schedules;
    } catch (error) {
      console.error('Error fetching all schedules of student:', error);
      throw new Error('Could not fetch schedules. Please try again.');
    }
  }

  async findClassListTeacher(user: IUser) {
    const classesList = await this.scheduleRepository.find({
      where: { teacher: { id: user.id } },
      relations: ['class', 'subject'],
      order: {
        id: 'ASC',
      },
    });
    return classesList;
  }

  async showStudentClass(id: number) {
    const classStudent = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.class', 'class')
      .leftJoinAndSelect('class.students', 'students')
      .leftJoinAndSelect('schedule.subject', 'subject')
      .leftJoinAndSelect(
        'students.scores',
        'scores',
        'scores.subject.id = schedule.subject.id AND scores.semester.id = schedule.semester.id',
      )
      .where('schedule.id = :id', { id })
      .orderBy('students.id', 'ASC') 
      .getOne();

    return classStudent;
  }

  async showAllDetailStudent(user: IUser) {
    const detailStudent = await this.scheduleRepository.find({
      where: {
        class: {
          students: {
            id: user.id,
          },
        },
      },
      relations: ['subject', 'subject.scores'],
    });

    return detailStudent;
  }
}
