import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DayOfWeekService } from './day-of-week.service';
import { CreateDayOfWeekDto } from './dto/create-day-of-week.dto';
import { UpdateDayOfWeekDto } from './dto/update-day-of-week.dto';

@Controller('day-of-week')
export class DayOfWeekController {
  constructor(private readonly dayOfWeekService: DayOfWeekService) {}

  @Post('bulk-day-of-week')
  createMany(@Body() createDaysOfWeekDto: CreateDayOfWeekDto[]) {
    return this.dayOfWeekService.createMany(createDaysOfWeekDto);
  }

  @Post()
  create(@Body() createDayOfWeekDto: CreateDayOfWeekDto) {
    return this.dayOfWeekService.create(createDayOfWeekDto);
  }

  @Get()
  findAll() {
    return this.dayOfWeekService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dayOfWeekService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDayOfWeekDto: UpdateDayOfWeekDto,
  ) {
    return this.dayOfWeekService.update(+id, updateDayOfWeekDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dayOfWeekService.remove(+id);
  }
}
