import { Injectable } from '@nestjs/common';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Floor } from './entities/floor.entity';
import { ILike, Repository } from 'typeorm';
import { Building } from '../building/entities/building.entity';
import aqp from 'api-query-params';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(Floor)
    private floorRepository: Repository<Floor>,

    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
  ) {}
  async create(createFloorDto: CreateFloorDto) {
    const checkBuilding = await this.buildingRepository.findOne({
      where: { id: createFloorDto.buildingID },
      relations: ['floors'],
    });

    if (!checkBuilding) {
      return 'Building not found';
    }

    if (!checkBuilding.hasFloors) {
      return 'This building does not support floors.';
    }

    const currentFloors = checkBuilding.floors.length;
    if (
      checkBuilding.totalFloors !== null &&
      currentFloors >= checkBuilding.totalFloors
    ) {
      return `Cannot add more floors. Building has reached the limit of ${checkBuilding.totalFloors} floors.`;
    }

    const floor = this.floorRepository.create({
      name: createFloorDto.name,
      floorNumber: currentFloors + 1,
      building: checkBuilding,
    });

    return await this.floorRepository.save(floor);
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

    const totalItems = await this.floorRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.floorRepository.find({
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
    return `This action returns a #${id} floor`;
  }

  update(id: number, updateFloorDto: UpdateFloorDto) {
    return `This action updates a #${id} floor`;
  }

  remove(id: number) {
    return `This action removes a #${id} floor`;
  }
}
