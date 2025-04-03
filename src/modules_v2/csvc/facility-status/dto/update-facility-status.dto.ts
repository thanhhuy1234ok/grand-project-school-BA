import { PartialType } from '@nestjs/mapped-types';
import { CreateFacilityStatusDto } from './create-facility-status.dto';

export class UpdateFacilityStatusDto extends PartialType(CreateFacilityStatusDto) {}
