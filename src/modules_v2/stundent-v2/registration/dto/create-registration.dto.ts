import { IsArray, IsInt, IsNotEmpty } from "class-validator";

export class CreateRegistrationDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsInt({ each: true })
  subjectIds: number[];

  @IsInt()
  @IsNotEmpty()
  semesterId: number;
}
