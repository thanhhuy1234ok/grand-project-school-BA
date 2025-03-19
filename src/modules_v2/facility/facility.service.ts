import { Injectable } from '@nestjs/common';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Facility } from './entities/facility.entity';
import { FacilityCategory } from '../facility-category/entities/facility-category.entity';
import { FacilityStatus } from '../facility-status/entities/facility-status.entity';
import { Room } from 'src/room/entities/room.entity';
import { Supplier } from '../supplier/entities/supplier.entity';
import aqp from 'api-query-params';

@Injectable()
export class FacilityService {
  constructor(
    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>,

    @InjectRepository(FacilityCategory)
    private categoryRepository: Repository<FacilityCategory>,

    @InjectRepository(FacilityStatus)
    private statusRepository: Repository<FacilityStatus>,

    @InjectRepository(Room)
    private roomRepository: Repository<Room>,

    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async create(dto: CreateFacilityDto): Promise<Facility> {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) throw new Error('Facility Category not found');

    const status = await this.statusRepository.findOne({
      where: { id: dto.statusId },
    });
    if (!status) throw new Error('Facility Status not found');

    let room = null;
    if (dto.roomId) {
      room = await this.roomRepository.findOne({ where: { id: dto.roomId } });
      if (!room) throw new Error('Room not found');
    }

    let supplier = null;
    if (dto.supplierId) {
      supplier = await this.supplierRepository.findOne({
        where: { id: dto.supplierId },
      });
      if (!supplier) throw new Error('Supplier not found');
    }

    const facility = this.facilityRepository.create({
      name: dto.name,
      category,
      status,
      room,
      supplier,
      purchaseDate: dto.purchaseDate,
      price: dto.price,
      warrantyExpiry: dto.warrantyExpiry,
    });

    return this.facilityRepository.save(facility);
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

    const totalItems = await this.facilityRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.facilityRepository.find({
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
