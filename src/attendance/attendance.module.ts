import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Score } from 'src/score/entities/score.entity';
import { ScoreModule } from 'src/score/score.module';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService],
  imports: [TypeOrmModule.forFeature([Attendance, Schedule, Class, Score])],
})
export class AttendanceModule {}
