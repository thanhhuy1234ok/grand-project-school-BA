import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FacilityStatusService } from './facility-status.service';
import { CreateFacilityStatusDto } from './dto/create-facility-status.dto';
import { UpdateFacilityStatusDto } from './dto/update-facility-status.dto';

@Controller('facility-status')
export class FacilityStatusController {
  constructor(private readonly facilityStatusService: FacilityStatusService) {}

  @Post()
  create(@Body() createFacilityStatusDto: CreateFacilityStatusDto) {
    return this.facilityStatusService.create(createFacilityStatusDto);
  }

  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.facilityStatusService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facilityStatusService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFacilityStatusDto: UpdateFacilityStatusDto,
  ) {
    return this.facilityStatusService.update(+id, updateFacilityStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facilityStatusService.remove(+id);
  }
}
