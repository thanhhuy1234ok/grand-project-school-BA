import { Module } from '@nestjs/common';
import { FacilityAssignmentService } from './facility-assignment.service';
import { FacilityAssignmentController } from './facility-assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityAssignment } from './entities/facility-assignment.entity';
import { Facility } from '../facility/entities/facility.entity';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/room/entities/room.entity';

@Module({
  controllers: [FacilityAssignmentController],
  providers: [FacilityAssignmentService],
  imports: [
    TypeOrmModule.forFeature([FacilityAssignment, Facility, User, Room]),
  ],
})
export class FacilityAssignmentModule {}
