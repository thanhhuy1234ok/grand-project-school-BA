import { PartialType } from '@nestjs/mapped-types';
import { CreateFacilityAssignmentDto } from './create-facility-assignment.dto';

export class UpdateFacilityAssignmentDto extends PartialType(CreateFacilityAssignmentDto) {}
