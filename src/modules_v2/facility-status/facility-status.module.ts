import { Module } from '@nestjs/common';
import { FacilityStatusService } from './facility-status.service';
import { FacilityStatusController } from './facility-status.controller';
import { FacilityStatus } from './entities/facility-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [FacilityStatusController],
  providers: [FacilityStatusService],
  imports: [TypeOrmModule.forFeature([FacilityStatus])],
})
export class FacilityStatusModule {}
