import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';
import { Subject } from './entities/subject.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const checkCode = await this.subjectRepository.findOne({
      where: { code: createSubjectDto.code, name: createSubjectDto.name },
    });
    if (checkCode) {
      throw new Error('Subject already exists');
    }

    return this.subjectRepository.save(createSubjectDto);
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

    const totalItems = await this.subjectRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    // Truy vấn dữ liệu với phân trang
    const result = await this.subjectRepository.find({
      where: whereCondition,
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
    return `This action returns a #${id} subject`;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}
