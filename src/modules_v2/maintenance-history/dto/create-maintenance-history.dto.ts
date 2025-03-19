import { IsNotEmpty, IsInt, IsString, IsDate } from 'class-validator';

export class CreateMaintenanceHistoryDto {
  @IsNotEmpty()
  @IsInt()
  facilityId: number;

  @IsNotEmpty()
  @IsDate()
  maintenanceDate: Date;

  @IsNotEmpty()
  @IsString()
  maintenanceType: string;

  @IsNotEmpty()
  @IsInt()
  technician: number;

  @IsString()
  notes?: string;
}
