import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';

export class CreateFacilityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @IsNotEmpty()
  @IsInt()
  statusId: number;

  @IsOptional()
  @IsInt()
  roomId?: number;

  @IsOptional()
  @IsInt()
  supplierId?: number;

  @IsOptional()
  // @IsDate()
  purchaseDate: Date;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsDate()
  warrantyExpiry?: Date;
  
}
