import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registration } from './entities/registration.entity';

@Module({
  controllers: [RegistrationController],
  providers: [RegistrationService],
  imports: [TypeOrmModule.forFeature([Registration])], // Add your entities here
})
export class RegistrationModule {}
