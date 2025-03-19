import { Module } from '@nestjs/common';
import { FacilityService } from './facility.service';
import { FacilityController } from './facility.controller';
import { Facility } from './entities/facility.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityCategory } from '../facility-category/entities/facility-category.entity';
import { FacilityStatus } from '../facility-status/entities/facility-status.entity';
import { Room } from 'src/room/entities/room.entity';
import { Supplier } from '../supplier/entities/supplier.entity';

@Module({
  controllers: [FacilityController],
  providers: [FacilityService],
  imports: [
    TypeOrmModule.forFeature([
      Facility,
      FacilityCategory,
      FacilityStatus,
      Room,
      Supplier,
    ]),
  ],
})
export class FacilityModule {}
