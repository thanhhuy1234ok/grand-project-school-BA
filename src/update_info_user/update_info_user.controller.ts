import { ResponseMessage } from './../helpers/decorator/customize';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UpdateInfoUserService } from './update_info_user.service';
import { CreateUpdateInfoUserDto } from './dto/create-update_info_user.dto';
import { UpdateUpdateInfoUserDto } from './dto/update-update_info_user.dto';
import { User } from 'src/helpers/decorator/customize';
import { IUser } from 'src/helpers/types/user.interface';

@Controller('update-info-user')
export class UpdateInfoUserController {
  constructor(private readonly updateInfoUserService: UpdateInfoUserService) {}

  @Post()
  @ResponseMessage(
    'Yêu cầu cập nhật của bạn đã được gửi và đang chờ phê duyệt.',
  )
  create(
    @Body() createUpdateInfoUserDto: CreateUpdateInfoUserDto,
    @User() user: IUser,
  ) {
    return this.updateInfoUserService.create(createUpdateInfoUserDto, user);
  }

  @Get('approve-update/:id')
  async approveUpdate(@Param('id') requestId: string) {
    await this.updateInfoUserService.approveUpdateRequest(requestId);
    return { message: 'Yêu cầu đã được phê duyệt thành công!' };
  }
}