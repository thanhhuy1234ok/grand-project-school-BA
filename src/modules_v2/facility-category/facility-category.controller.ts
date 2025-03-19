import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FacilityCategoryService } from './facility-category.service';
import { CreateFacilityCategoryDto } from './dto/create-facility-category.dto';
import { UpdateFacilityCategoryDto } from './dto/update-facility-category.dto';

@Controller('facility-category')
export class FacilityCategoryController {
  constructor(private readonly facilityCategoryService: FacilityCategoryService) {}

  @Post()
  create(@Body() createFacilityCategoryDto: CreateFacilityCategoryDto) {
    return this.facilityCategoryService.create(createFacilityCategoryDto);
  }

  @Get()
  findAll(
      @Query('current') currentPage: string,
            @Query('pageSize') limit: string,
            @Query() qs: string,
  ) {
    return this.facilityCategoryService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facilityCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacilityCategoryDto: UpdateFacilityCategoryDto) {
    return this.facilityCategoryService.update(+id, updateFacilityCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facilityCategoryService.remove(+id);
  }
}
