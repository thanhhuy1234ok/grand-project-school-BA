import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFacilityAssignmentDto } from './dto/create-facility-assignment.dto';
import { UpdateFacilityAssignmentDto } from './dto/update-facility-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Facility } from '../facility/entities/facility.entity';
import { ILike, Repository } from 'typeorm';
import { FacilityAssignment } from './entities/facility-assignment.entity';
import { IUser } from 'src/helpers/types/user.interface';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/room/entities/room.entity';
import aqp from 'api-query-params';

@Injectable()
export class FacilityAssignmentService {
  constructor(
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,

    @InjectRepository(FacilityAssignment)
    private assignmentRepository: Repository<FacilityAssignment>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}
  async create(dto: CreateFacilityAssignmentDto, user: IUser) {
    const facility = await this.facilityRepository.findOne({
      where: { id: dto.facility_id },
      relations: ['category'], // cần để kiểm tra tên category
    });

    if (!facility) throw new NotFoundException('Facility not found');
    if (dto.quantity <= 0)
      throw new BadRequestException('Số lượng phân bổ không hợp lệ');
    if (facility.remainingQuantity < dto.quantity)
      throw new BadRequestException('Không đủ thiết bị tồn kho để phân bổ');

    const checkUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });
    if (!checkUser) throw new NotFoundException('User not found');

    const room = await this.roomRepository.findOne({
      where: { id: dto.room_id },
    });
    if (!room) throw new NotFoundException('Room not found');

    // ✅ Kiểm tra nếu là bàn hoặc ghế, không được vượt quá maxCapacity
    const facilityName = facility.name.toLowerCase();

    const isBan = facilityName.includes('bàn');
    const isGhe = facilityName.includes('ghế');

    let totalAssigned = 0;

    if (isBan || isGhe) {
      const keyword = isBan ? '%bàn%' : '%ghế%';

      const result = await this.assignmentRepository
        .createQueryBuilder('assignment')
        .leftJoin('assignment.facility', 'facility')
        .where('assignment.room = :roomId', { roomId: dto.room_id })
        .andWhere('facility.name ILIKE :keyword', { keyword })
        .select('SUM(assignment.quantity)', 'total')
        .getRawOne();

      totalAssigned = Number(result?.total) || 0;

      const willBe = totalAssigned + Number(dto.quantity);

      if (willBe > Number(room.capacity)) {
        throw new BadRequestException(
          `Không thể phân bổ ${dto.quantity} ${facility.name} vì sẽ vượt quá sức chứa ${room.capacity} của phòng.`,
        );
      }
    }

    // ✅ Tạo bản ghi phân bổ
    const assignment = this.assignmentRepository.create({
      facility,
      room,
      quantity: dto.quantity,
      assignedBy: checkUser,
      assignedAt: new Date(),
    });

    // ✅ Trừ tồn kho
    await this.facilityRepository.decrement(
      { id: facility.id },
      'remainingQuantity',
      dto.quantity,
    );

    return this.assignmentRepository.save(assignment);
  }

  async createMany(dtos: CreateFacilityAssignmentDto[], user: IUser) {
    const results = [];

    const checkUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });
    if (!checkUser) throw new NotFoundException('User not found');

    for (const dto of dtos) {
      try {
        const facility = await this.facilityRepository.findOne({
          where: { id: dto.facility_id },
          relations: ['category'],
        });
        if (!facility) throw new NotFoundException('Facility not found');

        if (dto.quantity <= 0)
          throw new BadRequestException('Số lượng phân bổ không hợp lệ');
        if (facility.remainingQuantity < dto.quantity)
          throw new BadRequestException(
            `Không đủ thiết bị tồn kho để phân bổ cho ${facility.name}`,
          );

        const room = await this.roomRepository.findOne({
          where: { id: dto.room_id },
        });
        if (!room) throw new NotFoundException('Room not found');

        const facilityName = facility.name.toLowerCase();
        const isBan = facilityName.includes('bàn');
        const isGhe = facilityName.includes('ghế');
        let totalAssigned = 0;

        if (isBan || isGhe) {
          const keyword = isBan ? '%bàn%' : '%ghế%';

          const result = await this.assignmentRepository
            .createQueryBuilder('assignment')
            .leftJoin('assignment.facility', 'facility')
            .where('assignment.room = :roomId', { roomId: dto.room_id })
            .andWhere('facility.name ILIKE :keyword', { keyword })
            .select('SUM(assignment.quantity)', 'total')
            .getRawOne();

          totalAssigned = Number(result?.total) || 0;

          const willBe = totalAssigned + Number(dto.quantity);
          if (willBe > Number(room.capacity)) {
            throw new BadRequestException(
              `Không thể phân bổ ${dto.quantity} ${facility.name} vì sẽ vượt quá sức chứa ${room.capacity} của phòng.`,
            );
          }
        }

        const assignment = this.assignmentRepository.create({
          facility,
          room,
          quantity: dto.quantity,
          assignedBy: checkUser,
          assignedAt: new Date(),
        });

        await this.facilityRepository.decrement(
          { id: facility.id },
          'remainingQuantity',
          dto.quantity,
        );

        const saved = await this.assignmentRepository.save(assignment);
        results.push({ success: true, data: saved });
      } catch (error) {
        results.push({
          success: false,
          message: error.message,
          dto,
        });
      }
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

    const totalItems = await this.assignmentRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.assignmentRepository.find({
      where,
      skip: offset,
      take: defaultLimit,
      order,
      relations: [
        'room',
        'assignedBy',
        'facility',
        'room.building',
        'room.building.campus',
      ],
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
    return `This action returns a #${id} facilityAssignment`;
  }

  update(id: number, updateFacilityAssignmentDto: UpdateFacilityAssignmentDto) {
    return `This action updates a #${id} facilityAssignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} facilityAssignment`;
  }
}
