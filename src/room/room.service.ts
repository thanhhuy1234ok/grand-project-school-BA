import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from 'src/modules_v2/building/entities/building.entity';
import { Floor } from 'src/modules_v2/floor/entities/floor.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,

    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,
  ) {}

  // async create(createRoomDto: CreateRoomDto): Promise<Room> {
  //   const checkName = await this.roomRepository.findOne({
  //     where: { name: createRoomDto.name },
  //   });

  //   if (checkName) {
  //     throw new BadRequestException('Room name already exists');
  //   }

  //   const room = this.roomRepository.create(createRoomDto);
  //   return await this.roomRepository.save(room);
  // }

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
      const { name, buildingID, floorID, capacity, status } = createRoomDto;

      // Kiểm tra phòng có bị trùng tên không
      const existingRoom = await this.roomRepository.findOne({
        where: { name: name.trim() },
      });

      if (existingRoom) {
        throw new ConflictException(`Room with name "${name}" already exists.`);
      }

      // Kiểm tra xem tòa nhà có tồn tại không
      const building = await this.buildingRepository.findOne({
        where: { id: buildingID },
      });
      if (!building) {
        throw new NotFoundException(
          `Building with ID ${buildingID} not found.`,
        );
      }
      console.log(floorID);
      let floor: Floor | null = null;

      // Nếu tòa nhà có tầng, bắt buộc phải có floorID
      if (building.hasFloors) {
        if (floorID === undefined || floorID === null) {
          throw new BadRequestException(
            `Floor ID is required for buildings with floors.`,
          );
        }

        if (isNaN(floorID)) {
          throw new BadRequestException(`Floor ID must be a valid number.`);
        }

        // Kiểm tra xem tầng có tồn tại không
        floor = await this.floorRepository.findOne({ where: { id: floorID } });
        if (!floor) {
          throw new NotFoundException(`Floor with ID ${floorID} not found.`);
        }
      }

      // Tạo phòng mới
      const room = this.roomRepository.create({
        name: name.trim(),
        building,
        floor,
        capacity,
        status,
      });

      return await this.roomRepository.save(room);
  }

  async findAll(currentPage: number, limit: number, qs: string): Promise<any> {
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

    const totalItems = await this.roomRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roomRepository.find({
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
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
