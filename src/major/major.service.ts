import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Major } from './entities/major.entity';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class MajorService {
  constructor(
    @InjectRepository(Major)
    private readonly majorRepository: Repository<Major>,
  ) {}
  async create(createMajorDto: CreateMajorDto) {
    const checkCode = await this.majorRepository.findOne({
      where: { code: createMajorDto.code },
    });

    if (checkCode) {
      throw new BadRequestException('Code đã tồn tại');
    }

    const major = this.majorRepository.create(createMajorDto);
    return await this.majorRepository.save(major);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    const whereCondition = [];
    if (filter.name) {
      whereCondition.push({ name: ILike(`%${filter.name}%`) });
    }
    if (filter.code) {
      whereCondition.push({ code: ILike(`%${filter.code}%`) });
    }

    const where = whereCondition.length ? whereCondition : filter;

    let order = {};
    if (sort) {
      const [sortBy, sortOrder] = Object.entries(sort)[0];
      order = { [sortBy]: sortOrder === 1 ? 'ASC' : 'DESC' };
    }

    const totalItems = await this.majorRepository.count({
      where: filter,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.majorRepository.find({
      where,
      skip: offset,
      take: defaultLimit,
      order,
    });

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} major`;
  }

  update(id: number, updateMajorDto: UpdateMajorDto) {
    return `This action updates a #${id} major`;
  }

  remove(id: number) {
    return `This action removes a #${id} major`;
  }
}
