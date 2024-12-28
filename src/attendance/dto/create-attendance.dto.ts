import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsNumber()
  scheduleId: number;
}

export class QrGeneralCode {
  @IsNotEmpty()
  @IsNumber()
  scheduleId: number;

  @IsString()
  date: string;
}
