import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsString } from "class-validator";

export class CreateEnrollmentDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  classScheduleIds: number[];

}
