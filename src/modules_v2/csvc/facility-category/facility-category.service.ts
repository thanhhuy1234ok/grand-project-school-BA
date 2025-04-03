import { Injectable } from '@nestjs/common';
import { CreateFacilityCategoryDto } from './dto/create-facility-category.dto';
import { UpdateFacilityCategoryDto } from './dto/update-facility-category.dto';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityCategory } from './entities/facility-category.entity';

@Injectable()
export class FacilityCategoryService {
  constructor(
    @InjectRepository(FacilityCategory)
    private facilityCategoryRepository: Repository<FacilityCategory>,
  ) {}
  async create(dto: CreateFacilityCategoryDto) {
    const category = this.facilityCategoryRepository.create(dto);
    return this.facilityCategoryRepository.save(category);
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

    const totalItems = await this.facilityCategoryRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.facilityCategoryRepository.find({
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
    return `This action returns a #${id} facilityCategory`;
  }

  update(id: number, updateFacilityCategoryDto: UpdateFacilityCategoryDto) {
    return `This action updates a #${id} facilityCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} facilityCategory`;
  }
}
