import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateFacilityAssignmentDto {
  @IsNotEmpty()
  @IsInt()
  facilityId: number;

  @IsNotEmpty()
  @IsInt()
  roomId: number;
}
