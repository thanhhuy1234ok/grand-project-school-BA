import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFacilityStatusDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
