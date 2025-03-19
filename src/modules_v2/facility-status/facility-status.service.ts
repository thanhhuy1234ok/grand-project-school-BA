import { Injectable } from '@nestjs/common';
import { CreateFacilityStatusDto } from './dto/create-facility-status.dto';
import { UpdateFacilityStatusDto } from './dto/update-facility-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityStatus } from './entities/facility-status.entity';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class FacilityStatusService {
  constructor(
    @InjectRepository(FacilityStatus)
    private facilityStatusRepository: Repository<FacilityStatus>,
  ) {}
  create(createFacilityStatusDto: CreateFacilityStatusDto) {
    const status = this.facilityStatusRepository.create(
      createFacilityStatusDto,
    );
    return this.facilityStatusRepository.save(status);
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

    const totalItems = await this.facilityStatusRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.facilityStatusRepository.find({
      where,
      skip: offset,
      take: defaultLimit,
      order,
    });

    // Trả về kết quả và thông tin phân trang
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
    return `This action returns a #${id} facilityStatus`;
  }

  update(id: number, updateFacilityStatusDto: UpdateFacilityStatusDto) {
    return `This action updates a #${id} facilityStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} facilityStatus`;
  }
}
