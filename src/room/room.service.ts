import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const checkName = await this.roomRepository.findOne({
      where: { name: createRoomDto.name },
    });

    if (checkName) {
      throw new BadRequestException('Room name already exists');
    }

    const room = this.roomRepository.create(createRoomDto);
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
