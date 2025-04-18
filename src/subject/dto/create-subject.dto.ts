import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsInt()
  @Min(1, { message: 'Số tín chỉ phải lớn hơn 0' })
  @Max(6, { message: 'Số tín chỉ không được vượt quá 6' })
  credits: number;

  @IsString()
  type: string;

  @IsInt()
  @Min(0, { message: 'Giá môn học không được âm' })
  price: number;
}
