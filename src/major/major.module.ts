import { Module } from '@nestjs/common';
import { MajorService } from './major.service';
import { MajorController } from './major.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Major } from './entities/major.entity';

@Module({
  controllers: [MajorController],
  providers: [MajorService],
  imports: [TypeOrmModule.forFeature([Major])],
})
export class MajorModule {}
