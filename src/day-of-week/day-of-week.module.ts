import { Module } from '@nestjs/common';
import { DayOfWeekService } from './day-of-week.service';
import { DayOfWeekController } from './day-of-week.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayOfWeek } from './entities/day-of-week.entity';

@Module({
  controllers: [DayOfWeekController],
  providers: [DayOfWeekService],
  imports: [TypeOrmModule.forFeature([DayOfWeek])],
})
export class DayOfWeekModule {}
