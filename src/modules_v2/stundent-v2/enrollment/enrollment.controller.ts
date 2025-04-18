import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { User } from 'src/helpers/decorator/customize';
import { IUser } from 'src/helpers/types/user.interface';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @User() user: IUser,
  ) {
    return this.enrollmentService.create(createEnrollmentDto, user);
  }

 @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
    @User() user: IUser,
  ) {
    return this.enrollmentService.findAll(+currentPage, +limit, qs,user);
  }

  @Get('registered')
  async getRegisteredSubjects(@User() user:IUser) {

    return this.enrollmentService.getRegisteredSubjects(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentService.update(+id, updateEnrollmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentService.remove(+id);
  }
}
