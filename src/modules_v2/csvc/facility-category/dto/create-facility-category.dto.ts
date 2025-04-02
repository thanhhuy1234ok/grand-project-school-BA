import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFacilityCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
