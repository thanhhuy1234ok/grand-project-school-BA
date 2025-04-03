import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { MaintenanceStatus } from "src/helpers/enum/enum.global";

export class CreateMaintenanceHistoryDto {
  @IsInt()
  facility_id: number;

  @IsInt()
  room_id: number;

  @IsOptional()
  @IsInt()
  technician_id?: number;

  @IsNotEmpty()
  maintenance_type: string;

  @IsEnum(MaintenanceStatus)
  status: MaintenanceStatus;

  @IsOptional()
  notes?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;
}
