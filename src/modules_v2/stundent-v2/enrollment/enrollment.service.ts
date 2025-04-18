import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { ILike, In, Repository } from 'typeorm';
import { ClassSchedule } from '../class-schedule/entities/class-schedule.entity';
import { IUser } from 'src/helpers/types/user.interface';
import { STUDENTROLE } from 'src/helpers/types/constans';
import { EnrollmentStatus } from 'src/helpers/enum/enum.global';
import aqp from 'api-query-params';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,

    @InjectRepository(ClassSchedule)
    private classScheduleRepo: Repository<ClassSchedule>,
  ) {}
  async create(createEnrollmentDto: CreateEnrollmentDto, user: IUser) {
    const { classScheduleIds } = createEnrollmentDto;

    if (user.role.name !== STUDENTROLE) {
      throw new ForbiddenException('Chỉ sinh viên mới được đăng ký môn học');
    }

    // Lấy toàn bộ các schedule được chọn
    const selectedSchedules = await this.classScheduleRepo.findBy({
      id: In(classScheduleIds),
    });

    if (selectedSchedules.length !== classScheduleIds.length) {
      throw new BadRequestException('Một hoặc nhiều lịch học không tồn tại');
    }

    // Lấy danh sách lịch học mà sinh viên đã đăng ký
    const existedEnrollments = await this.enrollmentRepo.find({
      where: { student: { id: user.id } },
      relations: ['classSchedule'],
    });

    const enrolledSchedules = existedEnrollments.map((e) => e.classSchedule);

    const enrollmentsToSave = [];

    for (const schedule of selectedSchedules) {
      const alreadyEnrolled = enrolledSchedules.some(
        (s) => s.id === schedule.id,
      );

      if (alreadyEnrolled) {
        // ❌ Bỏ qua nếu đã đăng ký môn này rồi
        continue;
      }

      const isConflict = enrolledSchedules
        .concat(enrollmentsToSave.map((e) => e.classSchedule))
        .some(
          (s) =>
            s.daysOfWeek === schedule.daysOfWeek &&
            s.lessons === schedule.lessons &&
            s.startTime === schedule.startTime &&
            s.endTime === schedule.endTime,
        );

      if (isConflict) {
        throw new BadRequestException(
          `⛔ Môn học trùng lịch: ${schedule.subject.name} vào ${schedule.daysOfWeek} - ${schedule.lessons} (${schedule.startTime} - ${schedule.endTime})`,
        );
      }

      const enrollment = this.enrollmentRepo.create({
        student: user,
        classSchedule: schedule,
        status: EnrollmentStatus.PENDING,
      });

      enrollmentsToSave.push({ ...enrollment, classSchedule: schedule });
    }
    if (enrollmentsToSave.length === 0) {
      throw new BadRequestException('Không có môn nào được đăng ký');
    }

    return this.enrollmentRepo.save(enrollmentsToSave);
  }

  async getRegisteredSubjects(user: IUser) {
    const enrollments = await this.enrollmentRepo.find({
      where: {
        student: { id: user.id },
      },
      relations: ['classSchedule'],
    });

    const result = enrollments.map((e) => ({
      classScheduleId: e.classSchedule.id,
      status: e.status,
    }));

    return { result };
  }

  async findAll(currentPage: number, limit: number, qs: string ,user:IUser): Promise<any> {
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

    const totalItems = await this.enrollmentRepo.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    // Truy vấn dữ liệu với phân trang
    const result = await this.enrollmentRepo.find({
      where: { student: { id: user.id }, ...whereCondition },
      relations: ['classSchedule', 'payment','classSchedule.subject','classSchedule.semester'],
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
    return `This action returns a #${id} enrollment`;
  }

  update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return `This action updates a #${id} enrollment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollment`;
  }
}
