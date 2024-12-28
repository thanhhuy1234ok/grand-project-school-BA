import { Module } from '@nestjs/common';
import { UpdateInfoUserService } from './update_info_user.service';
import { UpdateInfoUserController } from './update_info_user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateInfoUser } from './entities/update_info_user.entity';
import { User } from 'src/users/entities/user.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [UpdateInfoUserController],
  providers: [UpdateInfoUserService],
  imports: [TypeOrmModule.forFeature([UpdateInfoUser, User]), MailModule],
})
export class UpdateInfoUserModule {}
