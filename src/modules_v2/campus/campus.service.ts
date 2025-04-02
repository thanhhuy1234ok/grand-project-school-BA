import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Campus } from './entities/campus.entity';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class CampusService {
  constructor(
    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  async create(createCampusDto: CreateCampusDto) {
    const checkLocation = await this.campusRepository.findOne({
      where: [
        { location: createCampusDto.location },
        { name: createCampusDto.name },
      ],
    });

    if (checkLocation) {
      throw new BadRequestException('Campus name or location already exists');
    }

    return this.campusRepository.save(createCampusDto);
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

    const totalItems = await this.campusRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.campusRepository.find({
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
    return `This action returns a #${id} campus`;
  }

  update(id: number, updateCampusDto: UpdateCampusDto) {
    return `This action updates a #${id} campus`;
  }

  remove(id: number) {
    return `This action removes a #${id} campus`;
  }

  async getCampusSummary(campusId?: number): Promise<any> {
    const query = this.campusRepository
      .createQueryBuilder('campus')
      .leftJoin('campus.buildings', 'building')
      .leftJoin('building.floors', 'floor')
      .leftJoin('floor.rooms', 'room')
      .select([
        'campus.id AS "campusId"',
        'campus.name AS "campusName"',
        'COUNT(DISTINCT building.id) AS "totalBuildings"',
        'COUNT(DISTINCT floor.id) AS "totalFloors"',
        'COUNT(DISTINCT room.id) AS "totalRooms"',
        // 'COALESCE(SUM(room.capacity), 0) AS "totalSeats"',
      ])
      .groupBy('campus.id, campus.name')
      .orderBy('campus.id');

    if (campusId) {
      query.where('campus.id = :campusId', { campusId });
      return query.getRawOne();
    }

    return query.getRawMany();
  }

  async getCampusTotalSummary(): Promise<any> {
    return this.campusRepository
      .createQueryBuilder('campus')
      .leftJoin('campus.buildings', 'building')
      .leftJoin('building.floors', 'floor')
      .leftJoin('floor.rooms', 'room')
      .select([
        'COUNT(DISTINCT campus.id) AS "totalCampuses"',
        'COUNT(DISTINCT building.id) AS "totalBuildings"',
        'COUNT(DISTINCT room.id) AS "totalRooms"',
      ])
      .getRawOne();
  }

  async getDetailCampusById(id: number): Promise<Campus> {
    const campus = await this.campusRepository
      .createQueryBuilder('campus')
      .leftJoinAndSelect('campus.buildings', 'building')
      .leftJoinAndSelect('building.floors', 'floor')
      .leftJoinAndSelect('floor.rooms', 'floorRoom')
      .leftJoinAndSelect('building.rooms', 'buildingRoom')
      .where('campus.id = :id', { id })
      .getOne();

    if (!campus) {
      throw new BadRequestException('Campus not found');
    }

    // return campus;
    return this.formatCampus(campus);
  }

  private formatCampus(campus: Campus): any {
    return {
      name: campus.name,
      buildings: campus.buildings.map((building) => {
        const hasFloors = building.floors && building.floors.length > 0;

        const floors = hasFloors
          ? building.floors.map((floor) => ({
              floor: floor.floorNumber,
              rooms: floor.rooms?.map((room) => room.name) || [],
            }))
          : [];

        const directRooms = building.rooms?.map((room) => room.name) || [];

        const result: any = {
          name: building.name,
          floors: floors,
        };

        // 👉 Chỉ thêm roomsWithoutFloor nếu building không có tầng
        if (!hasFloors && directRooms.length > 0) {
          result.roomsWithoutFloor = directRooms;
        }

        return result;
      }),
    };
  }
}
