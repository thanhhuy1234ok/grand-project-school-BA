import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { CohortModule } from './cohort/cohort.module';
import { MajorModule } from './major/major.module';
import { RoomModule } from './room/room.module';
import { ClassesModule } from './classes/classes.module';
import { SemesterModule } from './semester/semester.module';
import { SubjectModule } from './subject/subject.module';
import { ScheduleModule } from './schedule/schedule.module';
import { DayOfWeekModule } from './day-of-week/day-of-week.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ScheduleModule as Cron } from '@nestjs/schedule';
import { ScoreModule } from './score/score.module';
import { MailModule } from './mail/mail.module';
import { UpdateInfoUserModule } from './update_info_user/update_info_user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabasesModule } from './databases/databases.module';
import { BuildingModule } from './modules_v2/building/building.module';
import { CampusModule } from './modules_v2/campus/campus.module';
import { FloorModule } from './modules_v2/floor/floor.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    Cron.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [],
        synchronize: true,
        autoLoadModels: true,
        autoLoadEntities: true,
        ssl: configService.get('DB_SSL') === 'true' 
          ? { 
              rejectUnauthorized: true // Hoặc true nếu muốn xác thực chứng chỉ
            } 
          : false,
              }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    CohortModule,
    MajorModule,
    RoomModule,
    ClassesModule,
    SemesterModule,
    SubjectModule,
    ScheduleModule,
    DayOfWeekModule,
    AttendanceModule,
    ScoreModule,
    MailModule,
    UpdateInfoUserModule,
    DatabasesModule,
    BuildingModule,
    CampusModule,
    FloorModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
