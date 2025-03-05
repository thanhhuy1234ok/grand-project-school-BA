import { Module } from '@nestjs/common';
import { FloorService } from './floor.service';
import { FloorController } from './floor.controller';
import { Floor } from './entities/floor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from '../building/entities/building.entity';

@Module({
  controllers: [FloorController],
  providers: [FloorService],
  imports:[TypeOrmModule.forFeature([Floor,Building])],
})
export class FloorModule {}
