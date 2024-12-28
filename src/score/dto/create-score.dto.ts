import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateScoreDto {
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @IsNumber()
  @IsNotEmpty()
  subjectId: number;
}
