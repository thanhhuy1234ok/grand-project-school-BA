import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { DayOfWeek } from 'src/day-of-week/entities/day-of-week.entity';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService],
  imports: [TypeOrmModule.forFeature([User, Role, DayOfWeek])],
})
export class DatabasesModule {}
