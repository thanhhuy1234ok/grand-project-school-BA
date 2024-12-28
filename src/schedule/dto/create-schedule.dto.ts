import { IsNotEmpty, IsString, IsDate, IsNumber } from 'class-validator';

export class CreateScheduleDto {
  @IsNumber()
  @IsNotEmpty()
  teacherId: number;

  @IsNumber()
  @IsNotEmpty()
  subjectId: number;

  @IsNumber()
  @IsNotEmpty()
  classId: number;

  @IsNotEmpty()
  dayOfWeek: number[];

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsNumber()
  @IsNotEmpty()
  room: number;

  @IsNumber()
  @IsNotEmpty()
  semesterId: number;
}
