import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FacilityAssignmentService } from './facility-assignment.service';
import { CreateFacilityAssignmentDto } from './dto/create-facility-assignment.dto';
import { UpdateFacilityAssignmentDto } from './dto/update-facility-assignment.dto';
import { User } from 'src/helpers/decorator/customize';
import { IUser } from 'src/helpers/types/user.interface';

@Controller('facility-assignment')
export class FacilityAssignmentController {
  constructor(private readonly facilityAssignmentService: FacilityAssignmentService) {}

  @Post()
  create(@Body() createFacilityAssignmentDto: CreateFacilityAssignmentDto, @User() user: IUser) {
    return this.facilityAssignmentService.create(createFacilityAssignmentDto, user);
  }

  @Get()
  findAll() {
    return this.facilityAssignmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facilityAssignmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacilityAssignmentDto: UpdateFacilityAssignmentDto) {
    return this.facilityAssignmentService.update(+id, updateFacilityAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facilityAssignmentService.remove(+id);
  }
}
