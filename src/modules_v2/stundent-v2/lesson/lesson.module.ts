import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { AttendanceV1 } from '../attendance-v1/entities/attendance-v1.entity';

@Module({
  controllers: [LessonController],
  providers: [LessonService],
  imports: [TypeOrmModule.forFeature([Lesson, AttendanceV1])], // Add the Lesson entity here if needed
})
export class LessonModule {}
