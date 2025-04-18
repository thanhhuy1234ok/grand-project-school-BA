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
import { FacilityCategoryModule } from './modules_v2/csvc/facility-category/facility-category.module';
import { FacilityStatusModule } from './modules_v2/csvc/facility-status/facility-status.module';
import { SupplierModule } from './modules_v2/csvc/supplier/supplier.module';
import { FacilityModule } from './modules_v2/csvc/facility/facility.module';
import { FacilityAssignmentModule } from './modules_v2/csvc/facility-assignment/facility-assignment.module';
import { MaintenanceHistoryModule } from './modules_v2/csvc/maintenance-history/maintenance-history.module';
import { RegistrationModule } from './modules_v2/stundent-v2/registration/registration.module';
import { PaymentModule } from './modules_v2/stundent-v2/payment/payment.module';
import { ClassScheduleModule } from './modules_v2/stundent-v2/class-schedule/class-schedule.module';
import { LessonModule } from './modules_v2/stundent-v2/lesson/lesson.module';
import { AttendanceV1Module } from './modules_v2/stundent-v2/attendance-v1/attendance-v1.module';
import { EnrollmentModule } from './modules_v2/stundent-v2/enrollment/enrollment.module';
import { VnPayModule } from './modules_v2/modules-payment/vn-pay/vn-pay.module';

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
    FacilityCategoryModule,
    FacilityStatusModule,
    SupplierModule,
    FacilityModule,
    FacilityAssignmentModule,
    MaintenanceHistoryModule,
    RegistrationModule,
    PaymentModule,
    ClassScheduleModule,
    LessonModule,
    AttendanceV1Module,
    EnrollmentModule,
    VnPayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
