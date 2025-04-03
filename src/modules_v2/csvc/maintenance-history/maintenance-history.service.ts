import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaintenanceHistoryDto } from './dto/create-maintenance-history.dto';
import { UpdateMaintenanceHistoryDto } from './dto/update-maintenance-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Facility } from '../facility/entities/facility.entity';
import { ILike, Repository } from 'typeorm';
import { FacilityAssignment } from '../facility-assignment/entities/facility-assignment.entity';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/room/entities/room.entity';
import { MaintenanceHistory } from './entities/maintenance-history.entity';
import aqp from 'api-query-params';

@Injectable()
export class MaintenanceHistoryService {
  constructor(
    @InjectRepository(MaintenanceHistory)
    private readonly maintenanceRepository: Repository<MaintenanceHistory>,

    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    @InjectRepository(FacilityAssignment)
    private assignmentRepository: Repository<FacilityAssignment>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}
  async create(dto: CreateMaintenanceHistoryDto) {
    const facility = await this.facilityRepository.findOne({
      where: { id: dto.facility_id },
      relations: ['category'], // để kiểm tra tên category nếu cần
    });

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    const room = await this.roomRepository.findOne({
      where: { id: dto.room_id },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    let technician = null;
    if (dto.technician_id) {
      technician = await this.usersRepository.findOne({
        where: { id: dto.technician_id },
      });
      if (!technician) {
        throw new NotFoundException('Technician not found');
      }
    }

    const quantity = dto.quantity ?? 1;

    // ✅ Tính tổng số thiết bị đã phân bổ trong phòng
    const totalAssigned = await this.assignmentRepository
      .createQueryBuilder('assignment')
      .where('assignment.facility = :facilityId', {
        facilityId: dto.facility_id,
      })
      .andWhere('assignment.room = :roomId', { roomId: dto.room_id })
      .select('SUM(assignment.quantity)', 'total')
      .getRawOne();

    const assigned = Number(totalAssigned.total) || 0;

    if (quantity > assigned) {
      throw new BadRequestException(
        `Không thể báo hỏng ${quantity} thiết bị vì phòng này chỉ có ${assigned}`,
      );
    }

    // ✅ Trừ số lượng trong assignment bằng cách thêm bản ghi âm
    const negativeAssignment = this.assignmentRepository.create({
      facility,
      room,
      quantity: -quantity, // ghi nhận như đang rút ra
      assignedBy: technician,
      assignedAt: new Date(),
    });
    await this.assignmentRepository.save(negativeAssignment);

    // ✅ Tạo lịch sử bảo trì
    const history = this.maintenanceRepository.create({
      facility,
      room,
      technician,
      maintenanceType: dto.maintenance_type,
      status: dto.status,
      notes: dto.notes,
      quantity: quantity,
      maintenanceDate: new Date(),
    });

    return this.maintenanceRepository.save(history);
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
      relations: ['room', 'facility'],
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
