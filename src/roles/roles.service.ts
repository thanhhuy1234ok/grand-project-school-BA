import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';
import { ConfigService } from '@nestjs/config';
import { ADMINROLE } from 'src/helpers/types/constans';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private configService: ConfigService,
    // @InjectRepository(Permission)
    // private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name, description, isActive } = createRoleDto;

    const isCheckName = await this.roleRepository.findOne({
      where: { name: name },
    });

    if (isCheckName) {
      throw new BadRequestException(`${name} đã tồn tại`);
    }
    const newRole = await this.roleRepository.create({
      name,
      description,
      isActive,
      // permissions: permissionsEntities,
      createdAt: new Date(),
    });

    return await this.roleRepository.save(newRole);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    const whereCondition = [];
if (
  filter.name &&
  typeof filter.name === 'string' &&
  filter.name.trim() !== ''
) {
  whereCondition.push({ name: ILike(`%${filter.name.trim()}%`) });
}

   const where = whereCondition.length > 0 ? whereCondition : {};

    let order = {};
    if (sort) {
      const [sortBy, sortOrder] = Object.entries(sort)[0];
      order = { [sortBy]: sortOrder === 1 ? 'ASC' : 'DESC' };
    }

  const totalItems = await this.roleRepository.count({
    where,
  });

    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.roleRepository.find({
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

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with id #${id} not found`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with id #${id} not found`);
    }
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: number) {
    const foundRole = await this.roleRepository.findOne({
      where: { id },
    });

    if (foundRole.name === ADMINROLE) {
      throw new BadRequestException('Không thể role ADMIN');
    }

    return await this.roleRepository.update(
      { id },
      {
        deletedAt: new Date(),
        isActive: true,
      },
    );
  }
}
