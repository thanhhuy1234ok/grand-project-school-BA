import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceV1Dto } from './create-attendance-v1.dto';

export class UpdateAttendanceV1Dto extends PartialType(CreateAttendanceV1Dto) {}
