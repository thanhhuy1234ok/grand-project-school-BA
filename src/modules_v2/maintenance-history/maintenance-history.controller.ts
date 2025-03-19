import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MaintenanceHistoryService } from './maintenance-history.service';
import { CreateMaintenanceHistoryDto } from './dto/create-maintenance-history.dto';
import { UpdateMaintenanceHistoryDto } from './dto/update-maintenance-history.dto';
import { User } from 'src/helpers/decorator/customize';
import { IUser } from 'src/helpers/types/user.interface';

@Controller('maintenance-history')
export class MaintenanceHistoryController {
  constructor(
    private readonly maintenanceHistoryService: MaintenanceHistoryService,
  ) {}

  @Post()
  create(
    @Body() createMaintenanceHistoryDto: CreateMaintenanceHistoryDto,
    @User() user: IUser,
  ) {
    return this.maintenanceHistoryService.create(
      createMaintenanceHistoryDto,
      user,
    );
  }

  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.maintenanceHistoryService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaintenanceHistoryDto: UpdateMaintenanceHistoryDto,
  ) {
    return this.maintenanceHistoryService.update(
      +id,
      updateMaintenanceHistoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.maintenanceHistoryService.remove(+id);
  }
}
