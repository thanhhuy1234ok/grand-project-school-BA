import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendanceV1Service } from './attendance-v1.service';
import { CreateAttendanceV1Dto } from './dto/create-attendance-v1.dto';
import { UpdateAttendanceV1Dto } from './dto/update-attendance-v1.dto';

@Controller('attendance-v1')
export class AttendanceV1Controller {
  constructor(private readonly attendanceV1Service: AttendanceV1Service) {}

  @Post()
  create(@Body() createAttendanceV1Dto: CreateAttendanceV1Dto) {
    return this.attendanceV1Service.create(createAttendanceV1Dto);
  }

  @Get()
  findAll() {
    return this.attendanceV1Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceV1Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceV1Dto: UpdateAttendanceV1Dto) {
    return this.attendanceV1Service.update(+id, updateAttendanceV1Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceV1Service.remove(+id);
  }
}
