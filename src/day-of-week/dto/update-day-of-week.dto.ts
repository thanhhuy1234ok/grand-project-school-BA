import { PartialType } from '@nestjs/mapped-types';
import { CreateDayOfWeekDto } from './create-day-of-week.dto';

export class UpdateDayOfWeekDto extends PartialType(CreateDayOfWeekDto) {}
