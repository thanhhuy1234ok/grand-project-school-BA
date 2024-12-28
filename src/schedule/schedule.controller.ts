import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { User } from 'src/helpers/decorator/customize';
import { IUser } from 'src/helpers/types/user.interface';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.scheduleService.findAll(+currentPage, +limit, qs);
  }
  @Get('today')
  getTodaySchedules(@User() user: IUser, @Query('date') date: string) {
    return this.scheduleService.getTodaySchedules(user, date);
  }
  @Get('time-table')
  getTimeTable(@User() user: IUser) {
    return this.scheduleService.findAllSchedulesTeacher(user);
  }

  @Get('time-table-student')
  getTimeTableStudent(@User() user: IUser) {
    return this.scheduleService.findScheduleStudent(user);
  }

  @Get('class-list')
  getClassList(@User() user: IUser) {
    return this.scheduleService.findClassListTeacher(user);
  }

  @Get('schedule-class/:id')
  findStudentClass(@Param('id') id: string) {
    return this.scheduleService.showStudentClass(+id);
  }

  @Get('detail-student')
  showAllDetailStudent(@User() user: IUser) {
    return this.scheduleService.showAllDetailStudent(user);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
