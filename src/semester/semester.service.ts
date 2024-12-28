import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';
import { Cohort } from 'src/cohort/entities/cohort.entity';
import { IUser } from 'src/helpers/types/user.interface';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
    @InjectRepository(Cohort)
    private readonly cohortRepository: Repository<Cohort>,
  ) {}

  async create(createSemesterDto: CreateSemesterDto): Promise<Semester> {
    const { startDate, endDate } = createSemesterDto;

    if (startDate >= endDate) {
      throw new BadRequestException('Ngày kết thúc phải lớn hơn ngày bắt đầu!');
    }

    const cohort = await this.cohortRepository.findOne({
      where: { id: createSemesterDto.cohort },
    });
    if (!cohort) {
      throw new BadRequestException('Cohort không tồn tại!');
    }

    const semester = this.semesterRepository.create({
      ...createSemesterDto,
      cohort: cohort,
    });
    return await this.semesterRepository.save(semester);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
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

    const totalItems = await this.semesterRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.semesterRepository.find({
      where,
      relations: ['cohort'],
      skip: offset,
      take: defaultLimit,
      order,
    });

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} semester`;
  }

  async update(
    id: number,
    updateSemesterDto: UpdateSemesterDto,
  ): Promise<Semester> {
    const semester = await this.semesterRepository.findOne({ where: { id } });
    if (!semester) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }

    // Update the semester with new data
    Object.assign(semester, updateSemesterDto);
    return this.semesterRepository.save(semester);
  }

  remove(id: number) {
    return `This action removes a #${id} semester`;
  }

  async findAllScoreSemester(user: IUser) {
    const semesters = await this.semesterRepository
      .createQueryBuilder('semester')
      .leftJoinAndSelect('semester.cohort', 'cohort')
      .leftJoinAndSelect('cohort.students', 'student')
      .leftJoinAndSelect('student.scores', 'score')
      .leftJoinAndSelect('score.subject', 'subject')
      .leftJoin('score.semester', 'semesters') // Chỉ join để lấy id
      .where('student.id = :userId', { userId: user.id })
      .andWhere('semester.status = :status', { status: 0 })
      .select([
        'semester.id',
        'semester.name',
        'cohort.id',
        'student.id',
        'score',
        'subject',
        'semesters.id', 
      ])
      .getMany();

    const scoresBySemester = semesters.map((semester) => {
      const student = semester.cohort.students.find((s) => s.id === user.id);

      const scores = (student?.scores || []).filter(
        (score) => score.semester.id === semester.id,
      );

      return {
        id: semester.id,
        semesterName: semester.name,
        scores: scores.map((score) => ({
          id: score.id,
          attendanceScore: score.attendanceScore,
          midtermScore: score.midtermScore,
          finalScore: score.finalScore,
          subject: score.subject,
        })),
      };
    });

    return scoresBySemester;
  }
}
