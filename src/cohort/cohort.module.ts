import { Module } from '@nestjs/common';
import { CohortService } from './cohort.service';
import { CohortController } from './cohort.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cohort } from './entities/cohort.entity';

@Module({
  controllers: [CohortController],
  providers: [CohortService],
  imports: [TypeOrmModule.forFeature([Cohort])],
})
export class CohortModule {}
