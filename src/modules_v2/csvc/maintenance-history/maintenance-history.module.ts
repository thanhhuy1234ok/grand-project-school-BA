import { Module } from '@nestjs/common';
import { MaintenanceHistoryService } from './maintenance-history.service';
import { MaintenanceHistoryController } from './maintenance-history.controller';
import { MaintenanceHistory } from './entities/maintenance-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/room/entities/room.entity';
import { Facility } from '../facility/entities/facility.entity';
import { FacilityAssignment } from '../facility-assignment/entities/facility-assignment.entity';

@Module({
  controllers: [MaintenanceHistoryController],
  providers: [MaintenanceHistoryService],
  imports: [
    TypeOrmModule.forFeature([
      MaintenanceHistory,
      User,
      Room,
      Facility,
      FacilityAssignment,
    ]),
  ],
})
export class MaintenanceHistoryModule {}
