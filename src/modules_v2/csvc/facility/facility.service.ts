import { Injectable } from '@nestjs/common';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Facility } from './entities/facility.entity';
import { ILike, Repository } from 'typeorm';
import { FacilityCategory } from '../facility-category/entities/facility-category.entity';
import { FacilityStatus } from '../facility-status/entities/facility-status.entity';
import { Supplier } from '../supplier/entities/supplier.entity';
import aqp from 'api-query-params';

@Injectable()
export class FacilityService {
  constructor(
    @InjectRepository(Facility)
    private readonly facilityRepo: Repository<Facility>,

    @InjectRepository(FacilityCategory)
    private facilityCategoryRepository: Repository<FacilityCategory>,

    @InjectRepository(FacilityStatus)
    private facilityStatusRepository: Repository<FacilityStatus>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}
  async create(createFacilityDto: CreateFacilityDto) {
    const checkIDCategory = await this.facilityCategoryRepository.findOne({
      where: { id: createFacilityDto.category_id },
    });
    const checkIDStatus = await this.facilityStatusRepository.findOne({
      where: { id: createFacilityDto.status_id },
    });
    const checkIDSupplier = await this.supplierRepository.findOne({
      where: { id: createFacilityDto.supplier_id },
    });
    if (!checkIDCategory) {
      return { message: 'Category ID does not exist' };
    }
    if (!checkIDStatus) {
      return { message: 'Status ID does not exist' };
    }
    if (!checkIDSupplier) {
      return { message: 'Supplier ID does not exist' };
    }
    const facility = this.facilityRepo.create({
      ...createFacilityDto,
      category: checkIDCategory,
      status: checkIDStatus,
      supplier: checkIDSupplier,
      remainingQuantity: createFacilityDto.quantity,
    });
    return this.facilityRepo.save(facility);
  }

  async createMany(createFacilityDtos: CreateFacilityDto[]) {
    const results = [];

    for (const dto of createFacilityDtos) {
      const checkIDCategory = await this.facilityCategoryRepository.findOne({
        where: { id: dto.category_id },
      });
      const checkIDStatus = await this.facilityStatusRepository.findOne({
        where: { id: dto.status_id },
      });
      const checkIDSupplier = await this.supplierRepository.findOne({
        where: { id: dto.supplier_id },
      });

      if (!checkIDCategory || !checkIDStatus || !checkIDSupplier) {
        results.push({
          success: false,
          message: 'Invalid IDs',
          data: {
            name: dto.name,
            category_id: dto.category_id,
            status_id: dto.status_id,
            supplier_id: dto.supplier_id,
          },
        });
        continue;
      }

      const facility = this.facilityRepo.create({
        ...dto,
        category: checkIDCategory,
        status: checkIDStatus,
        supplier: checkIDSupplier,
        remainingQuantity: dto.quantity,
      });

      const saved = await this.facilityRepo.save(facility);
      results.push({ success: true, data: saved });
    }

    return results;
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

    const totalItems = await this.facilityRepo.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.facilityRepo.find({
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
    return `This action returns a #${id} facility`;
  }

  update(id: number, updateFacilityDto: UpdateFacilityDto) {
    return `This action updates a #${id} facility`;
  }

  remove(id: number) {
    return `This action removes a #${id} facility`;
  }
}
