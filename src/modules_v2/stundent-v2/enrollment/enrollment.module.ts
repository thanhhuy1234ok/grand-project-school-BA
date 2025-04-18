import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { ClassSchedule } from '../class-schedule/entities/class-schedule.entity';

@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  imports: [TypeOrmModule.forFeature([Enrollment, ClassSchedule])],
})
export class EnrollmentModule {}
