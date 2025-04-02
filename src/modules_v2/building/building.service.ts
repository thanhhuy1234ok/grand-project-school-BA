import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { ILike, Repository } from 'typeorm';
import { Building } from './entities/building.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Campus } from '../campus/entities/campus.entity';
import aqp from 'api-query-params';
import { Floor } from '../floor/entities/floor.entity';

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,

    @InjectRepository(Campus)
    private campusRepository: Repository<Campus>,

    @InjectRepository(Floor)
    private floorRepository: Repository<Floor>,
  ) {}
  async create(createBuildingDto: CreateBuildingDto) {
    const checkCampusId = await this.campusRepository.findOne({
      where: { id: createBuildingDto.campusID },
    });

    if (!checkCampusId) {
      throw new BadRequestException('Campus not found');
    }

    // Kiểm tra tên tòa nhà đã tồn tại chưa
    const checkName = await this.buildingRepository.findOne({
      where: { name: ILike(`%${createBuildingDto.name}%`) },
    });
    if (checkName) {
      throw new BadRequestException('Building name already exists');
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
    const savedBuilding = await this.buildingRepository.save(building);

    if (createBuildingDto.hasFloors) {
      const floorEntities = [];
      for (let i = 1; i <= createBuildingDto.totalFloors; i++) {
        floorEntities.push(
          this.floorRepository.create({
            floorNumber: i,
            building: savedBuilding,
            name: `Tầng ${i}`,
          }),
        );
      }

      await this.floorRepository.save(floorEntities);
    }

    return savedBuilding;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);

    // Xoá các field không liên quan
    delete filter.current;
    delete filter.pageSize;

    const page = currentPage || 1;
    const pageSize = limit || 10;
    const offset = (page - 1) * pageSize;

    // Xây dựng điều kiện where
    const where: any = {};

    // Nếu có campusID thì lọc, còn không thì bỏ qua
    if (filter.campusID) {
     where.campus = { id: filter.campusID };
    }

    // Thêm các filter khác nếu có (ngoại trừ campusID đã xử lý riêng)
    const otherFilters = { ...filter };
    delete otherFilters.campusID;
    Object.assign(where, otherFilters);

    // Xử lý sort
    let order = {};
    if (sort && Object.keys(sort).length > 0) {
      const [sortBy, sortOrder] = Object.entries(sort)[0];
      order = {
        [sortBy]: sortOrder === 1 ? 'ASC' : 'DESC',
      };
    }

    // Tổng số bản ghi
    const totalItems = await this.buildingRepository.count({ where });
    const totalPages = Math.ceil(totalItems / pageSize);

    // Lấy dữ liệu
    const result = await this.buildingRepository.find({
      where,
      skip: offset,
      take: pageSize,
      order,
    });

    return {
      meta: {
        current: page,
        pageSize,
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
