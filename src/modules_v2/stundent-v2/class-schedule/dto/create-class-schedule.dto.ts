import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateClassScheduleDto {
  @IsNumber()
  @IsNotEmpty()
  teacherId: number;

  @IsNumber()
  @IsNotEmpty()
  subjectId: number;

  @IsNotEmpty()
  dayOfWeekIds: number[];

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
  roomId: number;

  @IsNumber()
  @IsNotEmpty()
  semesterId: number;
}
