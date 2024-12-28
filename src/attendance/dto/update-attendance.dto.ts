import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from './create-attendance.dto';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AttendanceUpdateItemDto {
  @IsNotEmpty()
  @IsInt()
  studentId: number;

  @IsNotEmpty()
  @IsBoolean()
  isPresent: boolean;
}

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceUpdateItemDto)
  students: AttendanceUpdateItemDto[];
}
