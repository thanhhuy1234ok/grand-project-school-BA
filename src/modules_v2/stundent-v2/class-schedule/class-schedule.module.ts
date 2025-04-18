import { Module } from '@nestjs/common';
import { ClassScheduleService } from './class-schedule.service';
import { ClassScheduleController } from './class-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSchedule } from './entities/class-schedule.entity';
import { Lesson } from '../lesson/entities/lesson.entity';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { Semester } from 'src/semester/entities/semester.entity';

@Module({
  controllers: [ClassScheduleController],
  providers: [ClassScheduleService],
  imports: [TypeOrmModule.forFeature([ClassSchedule,Lesson, Room,User,Subject,Semester])],
})
export class ClassScheduleModule {}
