import { IsBoolean, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBuildingDto {
  @IsString()
  name: string;

  @IsNumber()
  campusID: number;

  @IsOptional()
  @IsInt()
  totalFloors: number;

  @IsOptional()
  @IsBoolean()
  hasFloors?: boolean = true;
}
