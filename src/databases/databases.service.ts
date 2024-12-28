import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { getHashPassword } from 'src/helpers/func/password.util';
import { ADMINROLE, STUDENTROLE, TEACHERROLE } from 'src/helpers/types/constans';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private configService: ConfigService,
  ) {}
  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.usersRepository.count();
      const countRole = await this.roleRepository.count();
      if (countRole === 0) {
        await this.roleRepository.save({
          name: ADMINROLE,
          description: 'admin role',
        });
        await this.roleRepository.save({
          name: TEACHERROLE,
          description: 'teacher role',
        });

        await this.roleRepository.save({
          name: STUDENTROLE,
          description: 'student role',
        });
      }

      const adminRole = await this.roleRepository.findOne({
        where: {
          name: ADMINROLE,
        },
      });
      await this.usersRepository.save({
        email: 'admin@gmail.com',
        name: 'admin',
        password: await getHashPassword(
          this.configService.get<string>('INIT_PASSWORD'),
        ),
        role: adminRole
      });

      if (countUser > 0 && countRole > 0) {
        this.logger.log('>>>> Database is already initialized');
      }
    }
  }
}
