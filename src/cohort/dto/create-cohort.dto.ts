import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class CreateCohortDto {
  @IsOptional()
  startYear?: number;

  @IsOptional()
  endYear?: number;
}
