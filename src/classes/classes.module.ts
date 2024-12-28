import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { User } from 'src/users/entities/user.entity';
import { Major } from 'src/major/entities/major.entity';
import { Cohort } from 'src/cohort/entities/cohort.entity';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService],
  imports: [TypeOrmModule.forFeature([Class, User, Major, Cohort])],
})
export class ClassesModule {}
