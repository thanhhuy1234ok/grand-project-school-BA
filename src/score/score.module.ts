import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';

@Module({
  controllers: [ScoreController],
  providers: [ScoreService],
  imports: [TypeOrmModule.forFeature([Score])],
  exports: [ScoreService],
})
export class ScoreModule {}
