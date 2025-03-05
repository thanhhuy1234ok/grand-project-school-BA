import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { ILike, Repository } from 'typeorm';
import { Building } from './entities/building.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Campus } from '../campus/entities/campus.entity';
import aqp from 'api-query-params';

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,

    @InjectRepository(Campus)
    private campusRepository: Repository<Campus>,
  ) {}
  async create(createBuildingDto: CreateBuildingDto) {
    const checkCampusId = await this.campusRepository.findOne({
      where: { id: createBuildingDto.campusID },
    });

    if (!checkCampusId) {
      throw new BadRequestException('Campus not found');
    }

    // Kiểm tra nếu hasFloors = true nhưng totalFloors không hợp lệ
    if (createBuildingDto.hasFloors) {
      if (
        createBuildingDto.totalFloors === undefined ||
        createBuildingDto.totalFloors === null ||
        createBuildingDto.totalFloors <= 0
      ) {
        throw new BadRequestException(
          'Building with floors must have a valid totalFloors value greater than 0.',
        );
      }
    } else {
      // Nếu không có tầng, luôn đảm bảo totalFloors là null
      createBuildingDto.totalFloors = null;
    }

    const building = this.buildingRepository.create({
      name: createBuildingDto.name,
      hasFloors: createBuildingDto.hasFloors,
      totalFloors: createBuildingDto.totalFloors,
      campus: checkCampusId,
    });

    return this.buildingRepository.save(building);
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

    const totalItems = await this.buildingRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.buildingRepository.find({
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
    return `This action returns a #${id} building`;
  }

  update(id: number, updateBuildingDto: UpdateBuildingDto) {
    return `This action updates a #${id} building`;
  }

  remove(id: number) {
    return `This action removes a #${id} building`;
  }
}
