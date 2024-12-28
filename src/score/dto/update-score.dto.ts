import { IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateScoreDto } from './create-score.dto';

export class UpdateScoreDto extends PartialType(CreateScoreDto) {
  @IsOptional()
  @IsNumber()
  midtermScore?: number;

  @IsOptional()
  @IsNumber()
  finalScore?: number;
}
