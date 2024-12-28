import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { ILike, Like, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Major } from 'src/major/entities/major.entity';
import { Cohort } from 'src/cohort/entities/cohort.entity';
import aqp from 'api-query-params';
import { IUser } from 'src/helpers/types/user.interface';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Major)
    private readonly majorRepository: Repository<Major>,
    @InjectRepository(Cohort)
    private readonly cohortRepository: Repository<Cohort>,
  ) {}

  async create(createClassDto: CreateClassDto) {
    const cohort = await this.cohortRepository.findOne({
      where: { id: createClassDto.cohortId },
    });
    const major = await this.majorRepository.findOne({
      where: { id: createClassDto.majorId },
    });

    if (!cohort || !major) {
      throw new BadRequestException('Cohort hoặc Major không được bỏ trống');
    }

    const yearSuffix = cohort.startYear.toString().slice(-2);

    const lastClass = await this.classRepository.findOne({
      where: {
        name: Like(`K${yearSuffix}-${major.code}-%`),
      },
      order: { name: 'DESC' },
    });

    let newSuffix = '01';
    if (lastClass) {
      const lastSuffix = parseInt(lastClass.name.split('-').pop() || '0', 10);
      newSuffix = (lastSuffix + 1).toString().padStart(2, '0');
    }

    const className = `K${yearSuffix}-${major.code}-${newSuffix}`;

    const newClass = this.classRepository.create({
      name: className,
      maxCapacity: createClassDto.maxCapacity,
    });

    return this.classRepository.save(newClass);
  }

  async findAll(currentPage: number, limit: number, qs: string): Promise<any> {
    const { filter, sort } = aqp(qs); // Parse query string với aqp

    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;
    const whereCondition = [];

    if (filter.name) {
      whereCondition.push({ name: ILike(`%${filter.name}%`) });
    }

    // if (filter.teacher) {
    //   whereCondition.push({ teacher: { name: ILike(`%${filter.teacher}%`) } });
    // }

    const where = whereCondition.length ? whereCondition : filter;

    let order = {};
    if (sort) {
      const [sortBy, sortOrder] = Object.entries(sort)[0];
      order = { [sortBy]: sortOrder === 1 ? 'ASC' : 'DESC' };
    }
    // Đếm tổng số class theo điều kiện
    const totalItems = await this.classRepository.count({
      where: filter,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.classRepository.find({
      where,
      relations: ['students'],
      skip: offset,
      take: defaultLimit,
      order,
    });
    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
