import { Injectable } from '@nestjs/common';
import { CreateMaintenanceHistoryDto } from './dto/create-maintenance-history.dto';
import { UpdateMaintenanceHistoryDto } from './dto/update-maintenance-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MaintenanceHistory } from './entities/maintenance-history.entity';
import { ILike, Repository } from 'typeorm';
import { IUser } from 'src/helpers/types/user.interface';
import { User } from 'src/users/entities/user.entity';
import { Facility } from '../facility/entities/facility.entity';
import aqp from 'api-query-params';

@Injectable()
export class MaintenanceHistoryService {
  constructor(
    @InjectRepository(MaintenanceHistory)
    private maintenanceRepository: Repository<MaintenanceHistory>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>,
  ) {}
  async create(
    createMaintenanceHistoryDto: CreateMaintenanceHistoryDto,
    user: IUser,
  ) {
    // Kiểm tra người dùng có tồn tại không
    const checkUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!checkUser) {
      return { message: 'User not found' };
    }

    // Kiểm tra thiết bị có tồn tại không
    const checkFacility = await this.facilityRepository.findOne({
      where: { id: createMaintenanceHistoryDto.facilityId },
    });
    if (!checkFacility) {
      return { message: 'Facility not found' };
    }

    // Tạo bản ghi lịch sử bảo trì
    const maintenanceHistory = this.maintenanceRepository.create({
      ...createMaintenanceHistoryDto,
      facility: checkFacility,
      technician: checkUser,
    });

    // Lưu bản ghi vào database
    return await this.maintenanceRepository.save(maintenanceHistory);
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

    const totalItems = await this.maintenanceRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.maintenanceRepository.find({
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
    return `This action returns a #${id} maintenanceHistory`;
  }

  update(id: number, updateMaintenanceHistoryDto: UpdateMaintenanceHistoryDto) {
    return `This action updates a #${id} maintenanceHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} maintenanceHistory`;
  }
}
