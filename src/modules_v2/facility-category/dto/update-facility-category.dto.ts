import { PartialType } from '@nestjs/mapped-types';
import { CreateFacilityCategoryDto } from './create-facility-category.dto';

export class UpdateFacilityCategoryDto extends PartialType(CreateFacilityCategoryDto) {}
