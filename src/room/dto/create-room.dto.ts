import { IsInt, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string; // Tên phòng

  @IsInt()
  @Min(1, { message: 'Sức chứa phải lớn hơn 0' })
  capacity: number;
}
