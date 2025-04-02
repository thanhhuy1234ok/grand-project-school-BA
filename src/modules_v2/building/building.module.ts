import { Module } from '@nestjs/common';
import { BuildingService } from './building.service';
import { BuildingController } from './building.controller';
import { Building } from './entities/building.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campus } from '../campus/entities/campus.entity';
import { Floor } from '../floor/entities/floor.entity';

@Module({
  controllers: [BuildingController],
  providers: [BuildingService],
  imports: [TypeOrmModule.forFeature([Building, Campus, Floor])],
})
export class BuildingModule {}
