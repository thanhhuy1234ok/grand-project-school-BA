import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cohort } from './entities/cohort.entity';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class CohortService {
  constructor(
    @InjectRepository(Cohort)
    private readonly cohortRepository: Repository<Cohort>,
  ) {}
  async create(createCohortDto: CreateCohortDto): Promise<Cohort> {
    const { startYear, endYear } = createCohortDto;

    if (!Number.isInteger(startYear)) {
      throw new BadRequestException('Năm nhập học phải là số nguyên');
    }

    if (!Number.isInteger(endYear)) {
      throw new BadRequestException('Năm kết thúc phải là số nguyên');
    }

    if (startYear <= 2000 || startYear >= 2100) {
      throw new BadRequestException(
        'Năm nhập học phải lớn hơn 2000 và nhỏ hơn 2100',
      );
    }

    if (endYear <= 2000 || endYear >= 2100) {
      throw new BadRequestException(
        'Năm kết thúc phải lớn hơn 2000 và nhỏ hơn 2100',
      );
    }

    const unitStartEndYear = await this.cohortRepository.findOne({
      where: { startYear: startYear, endYear: endYear },
    });

    if (unitStartEndYear) {
      throw new BadRequestException('Năm bắt đầu và kết thúc đã có');
    }

    if (startYear >= endYear) {
      throw new BadRequestException('End year must be greater than start year');
    }

    const cohort = this.cohortRepository.create(createCohortDto);
    return await this.cohortRepository.save(cohort);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    const whereCondition = [];
    if (filter.startYear) {
      whereCondition.push({ startYear: ILike(`%${filter.startYear}%`) });
    }
    if (filter.endYear) {
      whereCondition.push({ endYear: ILike(`%${filter.endYear}%`) });
    }

    const where = whereCondition.length ? whereCondition : filter;

    let order = {};
    if (sort) {
      const [sortBy, sortOrder] = Object.entries(sort)[0];
      order = { [sortBy]: sortOrder === 1 ? 'ASC' : 'DESC' };
    }

    const totalItems = await this.cohortRepository.count({
      where: filter,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.cohortRepository.find({
      where,
      skip: offset,
      take: defaultLimit,
      order,
    });

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} cohort`;
  }

  update(id: number, updateCohortDto: UpdateCohortDto) {
    return `This action updates a #${id} cohort`;
  }

  remove(id: number) {
    return `This action removes a #${id} cohort`;
  }
}
