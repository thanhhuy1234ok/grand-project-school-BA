import { PartialType } from '@nestjs/mapped-types';
import { CreateVnPayDto } from './create-vn-pay.dto';

export class UpdateVnPayDto extends PartialType(CreateVnPayDto) {}
