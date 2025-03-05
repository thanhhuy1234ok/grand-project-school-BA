import { Module } from '@nestjs/common';
import { CampusService } from './campus.service';
import { CampusController } from './campus.controller';
import { Campus } from './entities/campus.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CampusController],
  providers: [CampusService],
  imports:[TypeOrmModule.forFeature([Campus])],
})
export class CampusModule {}
