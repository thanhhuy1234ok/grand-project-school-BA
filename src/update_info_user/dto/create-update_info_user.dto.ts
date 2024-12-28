import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUpdateInfoUserDto {
  @IsNotEmpty()
  data: Record<string, any>; // Dữ liệu cần cập nhật

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: string;
}
