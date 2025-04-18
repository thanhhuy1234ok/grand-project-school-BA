import { Module } from '@nestjs/common';
import { AttendanceV1Service } from './attendance-v1.service';
import { AttendanceV1Controller } from './attendance-v1.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceV1 } from './entities/attendance-v1.entity';

@Module({
  controllers: [AttendanceV1Controller],
  providers: [AttendanceV1Service],
  imports: [TypeOrmModule.forFeature([AttendanceV1])], // Import any other modules if needed
})
export class AttendanceV1Module {}
