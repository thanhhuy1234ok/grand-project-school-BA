import { IsNotEmpty, IsInt, IsPositive, IsOptional } from 'class-validator';

export class CreateFacilityDto {
  @IsNotEmpty()
  name: string;

  @IsInt()
  category_id: number;

  @IsInt()
  status_id: number;

  @IsInt()
  supplier_id: number;
  @IsOptional()
  purchase_date?: string;
  @IsOptional()
  warranty_expiry?: string;

  @IsInt()
  quantity: number;

  @IsPositive()
  price: number;

  @IsOptional()
  description?: string;
}
