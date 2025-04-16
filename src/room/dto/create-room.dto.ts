import { IsArray, IsEmpty, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string; // Tên phòng

  @IsInt()
  @Min(1, { message: 'Sức chứa phải lớn hơn 0' })
  capacity: number;

  @IsEnum(['Available', 'Occupied', 'Under Maintenance'])
  status: 'Available' | 'Occupied' | 'Under Maintenance';

  @IsInt()
  buildingID: number;

  @IsOptional()
  @IsInt()
  floorID?: number;
}

export class CreateRoomFacility {
  @IsString()
  name: string; // Tên phòng

  @IsInt()
  @Min(1, { message: 'Sức chứa phải lớn hơn 0' })
  capacity: number;

  @IsEnum(['Available', 'Occupied', 'Under Maintenance'])
  status: 'Available' | 'Occupied' | 'Under Maintenance';

  @IsInt()
  buildingID: number;

  @IsOptional()
  @IsInt()
  floorID?: number;
  
  @IsOptional()
  @IsArray()
  equipments: EquipmentDTO[];
}

export interface EquipmentDTO {
  facilityID: number; // ID của thiết bị
  quantity: number; // Số lượng thiết bị
}
