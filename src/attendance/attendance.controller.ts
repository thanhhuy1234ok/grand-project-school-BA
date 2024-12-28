import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto,
  QrGeneralCode,
} from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from 'src/helpers/decorator/customize';
import { IUser } from 'src/helpers/types/user.interface';
import { Request } from 'express';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Post()
  create() {
    return this.attendanceService.create();
  }

  @Post('add-attendance')
  createFullSchedule(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.createAttendanceBySchedule(
      createAttendanceDto,
    );
  }

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('by-date')
  async getAttendanceByDate(
    @Query('scheduleId') scheduleId: string,
    @Query('date') date: Date,
  ) {
    return this.attendanceService.getAttendanceByDate(+scheduleId, date);
  }

  @Post('qrcode')
  async generateQRCode(@Body() data: QrGeneralCode) {
    const qrCode = await this.attendanceService.generateQRCode(data);
    return { qrCode };
  }

  @Post('scan')
  async handleQRScan(
    @Body('qrData') qrData: string,
    @User() user: IUser,
    @Req() req: Request,
  ) {
        const userIp = req.ip; 
            console.log('IP:', userIp);
            
    return this.attendanceService.scanQRAttendanceStudent(qrData, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateAttendanceDto: UpdateAttendanceDto,
  // ) {
  //   return this.attendanceService.updateAttendance(+id, updateAttendanceDto);
  // }

  @Put('update')
  async updateAttendance(
    @Query('scheduleId') scheduleId: string,
    @Query('date') date: Date,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.updateAttendance(
      +scheduleId,
      date,
      updateAttendanceDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }
}
