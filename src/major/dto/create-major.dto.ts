import { IsNotEmpty } from 'class-validator';

export class CreateMajorDto {
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'name không được để trống' })
  code: string;
}
