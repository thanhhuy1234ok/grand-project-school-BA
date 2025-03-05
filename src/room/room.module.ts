import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Building } from 'src/modules_v2/building/entities/building.entity';
import { Floor } from 'src/modules_v2/floor/entities/floor.entity';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [TypeOrmModule.forFeature([Room, Building,Floor])],
})
export class RoomModule {}
