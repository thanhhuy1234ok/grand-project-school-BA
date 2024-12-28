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
import { SemesterService } from './semester.service';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { User } from 'src/helpers/decorator/customize';
import { IUser } from 'src/helpers/types/user.interface';

@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post()
  create(@Body() createSemesterDto: CreateSemesterDto) {
    return this.semesterService.create(createSemesterDto);
  }

  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.semesterService.findAll(+currentPage, +limit, qs);
  }

  @Get('score-student')
  findScoreStudent(@User() user: IUser) {
    return this.semesterService.findAllScoreSemester(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semesterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ) {
    return this.semesterService.update(+id, updateSemesterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.semesterService.remove(+id);
  }
}
