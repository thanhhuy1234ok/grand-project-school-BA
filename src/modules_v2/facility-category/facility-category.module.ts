import { Module } from '@nestjs/common';
import { FacilityCategoryService } from './facility-category.service';
import { FacilityCategoryController } from './facility-category.controller';
import { FacilityCategory } from './entities/facility-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [FacilityCategoryController],
  providers: [FacilityCategoryService],
  imports: [TypeOrmModule.forFeature([FacilityCategory])],
})
export class FacilityCategoryModule {}
