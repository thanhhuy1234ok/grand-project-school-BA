import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassSchedule } from './entities/class-schedule.entity';
import { ILike, In, Repository } from 'typeorm';
import { Lesson } from '../lesson/entities/lesson.entity';
import dayjs from 'dayjs';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { Semester } from 'src/semester/entities/semester.entity';
import { TEACHERROLE } from 'src/helpers/types/constans';
import aqp from 'api-query-params';

@Injectable()
export class ClassScheduleService {
  constructor(
    @InjectRepository(ClassSchedule)
    private classScheduleRepository: Repository<ClassSchedule>,

    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,

    @InjectRepository(Room)
    private roomRepository: Repository<Room>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,

    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
  ) {}

  async create(createClassScheduleDto: CreateClassScheduleDto) {
    const {
      startDate,
      endDate,
      startTime,
      endTime,
      roomId,
      teacherId,
      subjectId,
      semesterId,
      dayOfWeekIds,
    } = createClassScheduleDto;

    const room = await this.checkRoomExists(roomId);
    const teacher = await this.checkTeacherExists(teacherId);
    const subject = await this.checkSubjectExists(subjectId);
    const semester = await this.checkSemesterExists(semesterId);

    // Tạo ClassSchedule mới
    const classSchedule = this.classScheduleRepository.create({
      startDate,
      endDate,
      startTime,
      endTime,
      room,
      teacher,
      subject,
      semester,
      daysOfWeek: dayOfWeekIds.map((id) => ({ id })),
    });

    const savedSchedule =
      await this.classScheduleRepository.save(classSchedule);

    // Gọi hàm generateLesson từ lịch vừa tạo
    await this.generateLessonsFromSchedule(savedSchedule.id);

    return savedSchedule;
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

    const totalItems = await this.classScheduleRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    // Truy vấn dữ liệu với phân trang
    const result = await this.classScheduleRepository.find({
      where: whereCondition,
      relations: ['subject', 'teacher', 'daysOfWeek'],
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
    return `This action returns a #${id} classSchedule`;
  }

  update(id: number, updateClassScheduleDto: UpdateClassScheduleDto) {
    return `This action updates a #${id} classSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} classSchedule`;
  }

  async generateLessonsFromSchedule(scheduleId: number) {
    const schedule = await this.classScheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['daysOfWeek', 'subject'],
    });

    if (!schedule) throw new Error('ClassSchedule not found');

    const dayNumbers = schedule.daysOfWeek.map((d) => d.id); // 1 = Monday, 7 = Sunday
    const lessons: Lesson[] = [];

    let count = 1;
    let current = dayjs(schedule.startDate);
    const end = dayjs(schedule.endDate);

    while (current.isBefore(end) || current.isSame(end)) {
      const dow = current.day() === 0 ? 7 : current.day();
      if (dayNumbers.includes(dow)) {
        const lesson = this.lessonRepository.create({
          date: current.format('YYYY-MM-DD'),
          isCancelled: false,
          classSchedule: schedule,
          name: `Lesson ${count}: ${schedule.subject.name}`,
        });
        lessons.push(lesson);
        count++;
      }
      current = current.add(1, 'day');
    }

    return await this.lessonRepository.save(lessons);
  }

  async checkRoomExists(roomId: number) {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room)
      throw new NotFoundException(`Phòng học ID ${roomId} không tồn tại`);
    return room;
  }

  async checkTeacherExists(teacherId: number) {
    const teacher = await this.userRepository.findOne({
      where: { id: teacherId, role: { name: TEACHERROLE } },
    });
    if (!teacher)
      throw new NotFoundException(`Giảng viên ID ${teacherId} không tồn tại`);
    return teacher;
  }

  async checkSubjectExists(subjectId: number) {
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId },
    });
    if (!subject)
      throw new NotFoundException(`Môn học ID ${subjectId} không tồn tại`);
    return subject;
  }

  async checkSemesterExists(semesterId: number) {
    const semester = await this.semesterRepository.findOne({
      where: { id: semesterId },
    });
    if (!semester)
      throw new NotFoundException(`Học kỳ ID ${semesterId} không tồn tại`);
    return semester;
  }
}
