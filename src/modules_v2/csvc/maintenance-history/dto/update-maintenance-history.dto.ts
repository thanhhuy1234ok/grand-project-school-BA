import { PartialType } from '@nestjs/mapped-types';
import { CreateMaintenanceHistoryDto } from './create-maintenance-history.dto';

export class UpdateMaintenanceHistoryDto extends PartialType(CreateMaintenanceHistoryDto) {}
