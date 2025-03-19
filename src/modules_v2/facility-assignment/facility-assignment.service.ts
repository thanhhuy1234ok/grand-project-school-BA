import { Injectable } from '@nestjs/common';
import { CreateFacilityAssignmentDto } from './dto/create-facility-assignment.dto';
import { UpdateFacilityAssignmentDto } from './dto/update-facility-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityAssignment } from './entities/facility-assignment.entity';
import { Repository } from 'typeorm';
import { IUser } from 'src/helpers/types/user.interface';
import { User } from 'src/users/entities/user.entity';
import { Facility } from '../facility/entities/facility.entity';
import { Room } from 'src/room/entities/room.entity';

@Injectable()
export class FacilityAssignmentService {
  constructor(
    @InjectRepository(FacilityAssignment)
    private assignmentRepository: Repository<FacilityAssignment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>,

    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(dto: CreateFacilityAssignmentDto, user:IUser) {
    const exitsUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!exitsUser) {
      throw new Error('User not found');
    }

    const exitsFacility = await this.facilityRepository.findOne({
      where: { id: dto.facilityId },
    });
    if (!exitsFacility) {
      throw new Error('Facility not found');
    }
    const exitsRoom = await this.roomRepository.findOne({
      where: { id: dto.roomId },
    });
    if (!exitsRoom) {
      throw new Error('Room not found');
    }
    const facilityAssignment = this.assignmentRepository.create({
      facility: exitsFacility,
      room: exitsRoom,
      assignedBy: exitsUser,
    });
    return this.assignmentRepository.save(facilityAssignment);
  }

  findAll() {
    return `This action returns all facilityAssignment`;
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
