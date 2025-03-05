import { IsNumber, IsString } from "class-validator";

export class CreateFloorDto {
    @IsString()
    name: string;
    @IsNumber()
    buildingID: number;
}
