import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DayOfWeek } from 'src/day-of-week/entities/day-of-week.entity';
import { getHashPassword } from 'src/helpers/func/password.util';
import {
  ADMINROLE,
  STUDENTROLE,
  TEACHERROLE,
} from 'src/helpers/types/constans';
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
    @InjectRepository(DayOfWeek)
    private readonly dayOfWeekRepository: Repository<DayOfWeek>,

    private configService: ConfigService,
  ) {}
  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.usersRepository.count();
      const countRole = await this.roleRepository.count();
      const countDayOfWeek = await this.dayOfWeekRepository.count();

      if (countDayOfWeek === 0) {
        await this.dayOfWeekRepository.save({
          id: 1,
          name: 'Monday',
          description: 'Monday',
        });
        await this.dayOfWeekRepository.save({
          id: 2,
          name: 'Tuesday',
          description: 'Tuesday',
        });
        await this.dayOfWeekRepository.save({
          id: 3,
          name: 'Wednesday',
          description: 'Wednesday',
        });
        await this.dayOfWeekRepository.save({
          id: 4,
          name: 'Thursday',
          description: 'Thursday',
        });
        await this.dayOfWeekRepository.save({
          id: 5,
          name: 'Friday',
          description: 'Friday',
        });
        await this.dayOfWeekRepository.save({
          id: 6,
          name: 'Saturday',
          description: 'Saturday',
        });
        await this.dayOfWeekRepository.save({
          id: 7,
          name: 'Sunday',
          description: 'Sunday',
        });
      }

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

      if (countUser === 0) {
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
          role: adminRole,
        });
      }

      if (countUser > 0 && countRole > 0 && countDayOfWeek > 0) {
        this.logger.log('>>>> Database is already initialized');
      }
    }
  }
}
