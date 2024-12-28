import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { DayOfWeek } from 'src/day-of-week/entities/day-of-week.entity';
import { User } from 'src/users/entities/user.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { Room } from 'src/room/entities/room.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Semester } from 'src/semester/entities/semester.entity';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    TypeOrmModule.forFeature([
      Schedule,
      DayOfWeek,
      User,
      Subject,
      Room,
      Class,
      Semester,
    ]),
  ],
})
export class ScheduleModule {}
