import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClassScheduleService } from './class-schedule.service';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';

@Controller('class-schedule')
export class ClassScheduleController {
  constructor(private readonly classScheduleService: ClassScheduleService) {}

  @Post()
  create(@Body() createClassScheduleDto: CreateClassScheduleDto) {
    return this.classScheduleService.create(createClassScheduleDto);
  }

  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.classScheduleService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassScheduleDto: UpdateClassScheduleDto) {
    return this.classScheduleService.update(+id, updateClassScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classScheduleService.remove(+id);
  }
}
