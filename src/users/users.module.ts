import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Major } from 'src/major/entities/major.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Cohort } from 'src/cohort/entities/cohort.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Role, Major, Class, Cohort]),
    MailModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
