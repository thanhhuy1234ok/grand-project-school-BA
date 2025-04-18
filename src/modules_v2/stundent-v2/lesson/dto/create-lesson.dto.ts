import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLessonDto {
    @IsString()
    date: string;

    @IsOptional()
    @IsString()
    name:string

    @IsOptional()
    @IsBoolean()
    isCancelled: boolean;

    @IsNumber()
    classScheduleId: number;
}
