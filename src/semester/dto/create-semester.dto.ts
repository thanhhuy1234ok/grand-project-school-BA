import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateSemesterDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên học kỳ không được để trống' })
  name: string;

  @Type(() => Date)
  @IsDate({ message: 'Ngày bắt đầu phải là kiểu Date hợp lệ' })
  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  startDate: Date;

  @Type(() => Date)
  @IsDate({ message: 'Ngày kết thúc phải là kiểu Date hợp lệ' })
  @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
  endDate: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isMainSemester?: boolean;

  @IsOptional()
  @IsNumber()
  @Max(21, { message: 'Số tín chỉ tối đa phải lớn hơn 21' })
  maxCredits?: number;

  @IsOptional()
  status?: number;

  @IsOptional()
  cohort: number;
}
