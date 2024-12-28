import { PartialType } from '@nestjs/mapped-types';
import { CreateUpdateInfoUserDto } from './create-update_info_user.dto';

export class UpdateUpdateInfoUserDto extends PartialType(CreateUpdateInfoUserDto) {}
