import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { User } from 'src/helpers/decorator/customize';
import { IUser } from 'src/helpers/types/user.interface';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  create(@Body() createScoreDto: CreateScoreDto[]) {
    return this.scoreService.create(createScoreDto);
  }

  @Get()
  findAll() {
    return this.scoreService.findAll();
  }

  @Get('student')
  showAllScoreUser(@User() user: IUser) {
    return this.scoreService.showAllScoreUser(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scoreService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScoreDto: UpdateScoreDto,
    @User() user: IUser,
  ) {
    return this.scoreService.update(+id, updateScoreDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scoreService.remove(+id);
  }
}
