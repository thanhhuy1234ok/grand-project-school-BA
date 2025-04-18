import { Injectable } from '@nestjs/common';
import { CreateAttendanceV1Dto } from './dto/create-attendance-v1.dto';
import { UpdateAttendanceV1Dto } from './dto/update-attendance-v1.dto';

@Injectable()
export class AttendanceV1Service {
  create(createAttendanceV1Dto: CreateAttendanceV1Dto) {
    return 'This action adds a new attendanceV1';
  }

  findAll() {
    return `This action returns all attendanceV1`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendanceV1`;
  }

  update(id: number, updateAttendanceV1Dto: UpdateAttendanceV1Dto) {
    return `This action updates a #${id} attendanceV1`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendanceV1`;
  }
}
