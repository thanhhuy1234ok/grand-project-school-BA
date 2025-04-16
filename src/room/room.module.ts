import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Building } from 'src/modules_v2/building/entities/building.entity';
import { Floor } from 'src/modules_v2/floor/entities/floor.entity';
import { FacilityAssignmentModule } from 'src/modules_v2/csvc/facility-assignment/facility-assignment.module';


@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [
    TypeOrmModule.forFeature([Room, Building, Floor]),
    FacilityAssignmentModule,
  ],
})
export class RoomModule {}
