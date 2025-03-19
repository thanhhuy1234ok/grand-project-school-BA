import { Module } from '@nestjs/common';
import { FacilityAssignmentService } from './facility-assignment.service';
import { FacilityAssignmentController } from './facility-assignment.controller';
import { FacilityAssignment } from './entities/facility-assignment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/room/entities/room.entity';
import { Facility } from '../facility/entities/facility.entity';

@Module({
  controllers: [FacilityAssignmentController],
  providers: [FacilityAssignmentService],
  imports: [TypeOrmModule.forFeature([FacilityAssignment,User,Facility,Room])],
})
export class FacilityAssignmentModule {}
