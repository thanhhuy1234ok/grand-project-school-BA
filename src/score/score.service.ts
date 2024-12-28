import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';
import { Repository } from 'typeorm';
import { IUser } from 'src/helpers/types/user.interface';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}
  create(createScoreDto: CreateScoreDto[]) {
    const scores = createScoreDto.map((dto) =>
      this.scoreRepository.create({
        student: { id: dto.studentId },
        subject: { id: dto.subjectId },
      }),
    );
    return this.scoreRepository.save(scores);
  }

  findAll() {
    return `This action returns all score`;
  }

  findOne(id: number) {
    return `This action returns a #${id} score`;
  }

  async update(id: number, updateScoreDto: UpdateScoreDto, user: IUser) {
    const score = await this.scoreRepository.findOne({
      where: { id },
      relations: ['subject', 'subject.schedules', 'subject.schedules.teacher'],
    });

    if (!score) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }

    const isAuthorized = score.subject.schedules.some(
      (schedule) => schedule.teacher.id === user.id,
    );

    if (!isAuthorized) {
      throw new ForbiddenException(`Giáo viên này không có quyền nhập điểm`);
    }
    Object.assign(score, updateScoreDto); // Cập nhật dữ liệu
    return this.scoreRepository.save(score); // Lưu vào DB
  }
  remove(id: number) {
    return `This action removes a #${id} score`;
  }

  async showAllScoreUser(user: IUser) {
    const score = await this.scoreRepository.find({
      where: { student: { id: user.id } },
      relations: ['subject', 'subject.schedules.semester'],
    });
    return score;
  }
}
