import { IsInt } from 'class-validator';

export class CreateClassDto {
  @IsInt()
  maxCapacity: number;

  @IsInt()
  majorId: number;

  @IsInt()
  cohortId: number;
}
