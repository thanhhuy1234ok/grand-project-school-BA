import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUpdateInfoUserDto } from './dto/create-update_info_user.dto';
import { UpdateUpdateInfoUserDto } from './dto/update-update_info_user.dto';
import { IUser } from 'src/helpers/types/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateInfoUser } from './entities/update_info_user.entity';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UpdateInfoUserService {
  constructor(
    @InjectRepository(UpdateInfoUser)
    private updateRequestRepo: Repository<UpdateInfoUser>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailService: MailService,
  ) {}
  async create(createUpdateInfoUserDto: CreateUpdateInfoUserDto, user: IUser) {
    const { data } = createUpdateInfoUserDto;

    const checkUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    if (!checkUser) {
      throw new BadRequestException('User không tồn tại');
    }

    const updateRequest = await this.updateRequestRepo.create({
      data,
      status: 'pending',
      user: user,
    });
    const dataReq = await this.updateRequestRepo.save(updateRequest);
    return await this.mailService.sendUpdateRequestNotification(user, dataReq);
  }

  async approveUpdateRequest(requestId: string) {
    const request = await this.updateRequestRepo.findOne({
      where: { id: requestId },
      relations: ['user'],
    });
    if (!request) throw new BadRequestException('Request not found');

    request.status = 'approved';
    await this.updateRequestRepo.save(request);

    const updatedUser = await this.usersRepository.update(
      { id: request.user.id },
      { ...request.data },
    );

    if (updatedUser.affected === 0) {
      throw new BadRequestException('Failed to update user information');
    }
    await this.mailService.sendUpdateSuccessEmail(
      request.user.email,
      request.user.name,
    );
    return updatedUser;
  }
}
