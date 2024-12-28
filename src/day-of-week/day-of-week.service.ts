import { Injectable } from '@nestjs/common';
import { CreateDayOfWeekDto } from './dto/create-day-of-week.dto';
import { UpdateDayOfWeekDto } from './dto/update-day-of-week.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DayOfWeek } from './entities/day-of-week.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DayOfWeekService {
  constructor(
    @InjectRepository(DayOfWeek)
    private readonly dayOfWeekRepository: Repository<DayOfWeek>,
  ) {}

  async createMany(createDaysOfWeekDto: CreateDayOfWeekDto[]) {
    const createdDays = await Promise.all(
      createDaysOfWeekDto.map(async (dayDto) => {
        const newDay = await this.dayOfWeekRepository.create(dayDto);
        return this.dayOfWeekRepository.save(newDay);
      }),
    );
    return createdDays;
  }
  create(createDayOfWeekDto: CreateDayOfWeekDto) {
    return 'This action adds a new dayOfWeek';
  }

  findAll() {
    return this.dayOfWeekRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} dayOfWeek`;
  }

  update(id: number, updateDayOfWeekDto: UpdateDayOfWeekDto) {
    return `This action updates a #${id} dayOfWeek`;
  }

  remove(id: number) {
    return `This action removes a #${id} dayOfWeek`;
  }
}
