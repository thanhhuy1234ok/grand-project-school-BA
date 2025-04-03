import { IsInt } from "class-validator";

export class CreateFacilityAssignmentDto {
  @IsInt()
  facility_id: number;
  @IsInt()
  room_id: number;
  @IsInt()
  quantity: number;
}
