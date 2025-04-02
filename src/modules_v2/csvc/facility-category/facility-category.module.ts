import { Module } from '@nestjs/common';
import { FacilityCategoryService } from './facility-category.service';
import { FacilityCategoryController } from './facility-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityCategory } from './entities/facility-category.entity';

@Module({
  controllers: [FacilityCategoryController],
  providers: [FacilityCategoryService],
  imports: [TypeOrmModule.forFeature([FacilityCategory])],
})
export class FacilityCategoryModule {}
