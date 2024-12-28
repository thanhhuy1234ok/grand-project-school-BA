import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsOptional()
  gender?: string;
  @IsOptional()
  address?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  date_of_birth?: Date;

  @IsNotEmpty({ message: 'Role không được để trống' })
  role: number;

  @IsOptional()
  major?: number;

  @IsOptional()
  class?: number;

  @IsOptional()
  yearOfAdmission?: number;
}

export class CreateManyUserDto {
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  role: string;

  @IsOptional()
  major: string;

  @IsOptional()
  class: string;

  @IsOptional()
  yearOfAdmission: number;
}
