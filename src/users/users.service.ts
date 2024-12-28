import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateManyUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, In, Repository } from 'typeorm';
import aqp from 'api-query-params';
import { getHashPassword, isValidPassword } from 'src/helpers/func/password.util';
import { Role } from 'src/roles/entities/role.entity';
import { Major } from 'src/major/entities/major.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Cohort } from 'src/cohort/entities/cohort.entity';
import dayjs from 'dayjs';
import { MailService } from 'src/mail/mail.service';
import { ChangePasswordAuthDto, ForgotPasswordAuthDto } from 'src/auth/dto/create-user.dto';
import { IUser } from 'src/helpers/types/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Major)
    private majorRepository: Repository<Major>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Cohort)
    private readonly cohortRepository: Repository<Cohort>,

    private mailService: MailService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const hashPassword = await getHashPassword(createUserDto.password);

    const role = await this.roleRepository.findOne({
      where: { id: createUserDto.role },
    });

    let major = null;
    if (createUserDto.major) {
      major = await this.majorRepository.findOne({
        where: { id: +createUserDto.major },
      });

      if (!major) {
        throw new BadRequestException(
          `Major with ID ${createUserDto.major} not found`,
        );
      }
    }

    let classEntity = null;
    if (createUserDto.class) {
      classEntity = await this.classRepository.findOne({
        where: { id: +createUserDto.class },
        relations: ['students'],
      });

      if (!classEntity) {
        throw new BadRequestException(
          `Class with ID ${createUserDto.class} not found`,
        );
      }

      if (classEntity.students.length >= classEntity.maxCapacity) {
        throw new BadRequestException(
          'Exceeding maximum number of students in the class',
        );
      }

      if (role.name !== 'STUDENT') {
        throw new BadRequestException(
          `${createUserDto.name} không phải là sinh viên`,
        );
      }
    }

    let cohortEntity = null;
    if (createUserDto.yearOfAdmission) {
          const cohort = await this.cohortRepository.findOne({
          where: { id: createUserDto.yearOfAdmission },
        });
        if (!cohort) {
          throw new BadRequestException('Cohort not found');
        }
        cohortEntity = cohort;
      }

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashPassword,
      role: role,
      major: major,
      class: classEntity,
      yearOfAdmission: cohortEntity,
    });

    return await this.usersRepository.save(newUser);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;

    const whereCondition = [];
    if (filter.name) {
      whereCondition.push({ name: ILike(`%${filter.name}%`) });
    }
    if (filter.email) {
      whereCondition.push({ email: ILike(`%${filter.email}%`) });
    }

    if (filter.role && filter.subjects) {
      whereCondition.push({
        role: { name: ILike(`%${filter.role}%`) },
        subjects: { name: ILike(`%${filter.subjects}%`) },
      });
    } else {
      if (filter.role) {
        whereCondition.push({ role: { name: ILike(`%${filter.role}%`) } });
      }
    }
    const where = whereCondition.length ? whereCondition : filter;

    let order = {};
    if (sort) {
      const [sortBy, sortOrder] = Object.entries(sort)[0];
      order = { [sortBy]: sortOrder === 1 ? 'ASC' : 'DESC' };
    }

    const totalItems = await this.usersRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.usersRepository.find({
      where,
      relations: ['major', 'class'],
      skip: offset,
      take: defaultLimit,
      order,
    });

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['class', 'yearOfAdmission'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userUpdate = await this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'major', 'class', 'yearOfAdmission'],
    });

    if (!userUpdate) {
      throw new NotFoundException(`User với ID ${id} không tồn tại`);
    }

    // Fetch and validate role
    let roleEntity = undefined;
    if (updateUserDto.role) {
      const role = await this.roleRepository.findOne({
        where: { id: updateUserDto.role },
      });
      if (!role) {
        throw new BadRequestException(
          `Role với ID ${updateUserDto.role} không tồn tại`,
        );
      }
      roleEntity = role;
    }

    // Fetch and validate major
    let majorEntity = undefined;
    if (updateUserDto.major) {
      const major = await this.majorRepository.findOne({
        where: { id: +updateUserDto.major },
      });
      if (!major) {
        throw new BadRequestException(
          `Major với ID ${updateUserDto.major} không tồn tại`,
        );
      }
      majorEntity = major;
    }

    // Fetch and validate class
    let classEntity = undefined;
    if (updateUserDto.class) {
      const classEntityTemp = await this.classRepository.findOne({
        where: { id: +updateUserDto.class },
        relations: ['students'],
      });

      if (!classEntityTemp) {
        throw new BadRequestException(
          `Class với ID ${updateUserDto.class} không tồn tại`,
        );
      }

      if (classEntityTemp.students.length >= classEntityTemp.maxCapacity) {
        throw new BadRequestException(
          'The class has reached its maximum capacity.',
        );
      }

      if (userUpdate.role?.name === 'STUDENT') {
        classEntity = classEntityTemp;
      }
    }

    let cohort = undefined;
    if (updateUserDto.yearOfAdmission) {
      const yearOfAdmission = await this.cohortRepository.findOne({
        where: { id: +updateUserDto.yearOfAdmission },
      });
      if (!yearOfAdmission) {
        throw new BadRequestException(
          `YearOfAdmission với ID ${updateUserDto.yearOfAdmission} không tồn tại`,
        );
      }
      cohort = yearOfAdmission;
    }

    // Prepare and execute update
    const updatedUser = {
      ...updateUserDto,
      role: roleEntity,
      major: majorEntity,
      class: classEntity,
      yearOfAdmission: cohort,
    };

    await this.usersRepository.update({ id }, updatedUser);

    return this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'major', 'class'],
    });
  }

  async remove(id: number) {
    const foundUser = await this.usersRepository.findOneBy({
      id,
    });
    if (!foundUser) return `not found user`;

    if (foundUser && foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException('Không thể Xóa tài khoản admin@gmail.com thì lấy gì test');
    }

    return await this.usersRepository.update(
      { id: id },
      {
        isActive: false,
        deletedAt: new Date(),
      },
    );
  }

  async findOneByUsername(username: string) {
    return await this.usersRepository.findOne({
      where: { email: username },
      relations: ['role'],
      select: {
        role: { id: true, name: true },
      },
    });
  }

  updateUserToken = async (refreshToken: string, id: number) => {
    return await this.usersRepository.update({ id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.usersRepository.findOne({
      where: { refreshToken: refreshToken },
      relations: ['role'],
      select: {
        role: { id: true, name: true },
      },
    });
  };

  async createManyUser(createManyUserDto: CreateManyUserDto[]) {
    const roleStudent = await this.roleRepository.findOne({
      where: { name: 'STUDENT' },
    });
    const roleName = createManyUserDto.map((dto) =>
      dto.role ? dto.role : roleStudent.name,
    );

    const roles = await this.roleRepository.find({
      where: {
        name: In(roleName),
      },
    });

    const roleMap = new Map(roles.map((role) => [role.name, role]));

    const majorIds = createManyUserDto.map((dto) => dto.major);
    const majors = await this.majorRepository.find({
      where: {
        code: In(majorIds),
      },
    });

    const majorMap = new Map(majors.map((major) => [major.code, major]));

    const classCodes = createManyUserDto.map((dto) => dto.class);
    const classes = await this.classRepository.find({
      where: {
        name: In(classCodes), // Tìm lớp qua mã
      },
    });

    const classMap = new Map(
      classes.map((classEntity) => [classEntity.name, classEntity]),
    );

    const cohortCodes = createManyUserDto.map((dto) => dto.yearOfAdmission);
    const cohorts = await this.cohortRepository.find({
      where: {
        startYear: In(cohortCodes),
      },
    });

    // Ánh xạ mã Cohort -> đối tượng Cohort
    const cohortMap = new Map(
      cohorts.map((cohort) => [cohort.startYear, cohort]),
    );

    console.log(cohortCodes);

    let countSuccess = 0;
    let countError = 0;

    const users = await Promise.all(
      createManyUserDto.map(async (dto) => {
        try {
          const existingUser = await this.usersRepository.findOne({
            where: { email: dto.email },
          });
          if (existingUser) {
            throw new BadRequestException(`Email ${dto.email} đã tồn tại`);
          }

          const role = roleMap.get(dto.role ? dto.role : roleStudent.name);
          if (!role) {
            throw new BadRequestException(
              `Không tìm thấy vai trò với tên "${dto.role || roleStudent.name}"`,
            );
          }

          const major = majorMap.get(dto.major);
          if (!major) {
            throw new BadRequestException(
              `Không tìm thấy ngành học với mã "${dto.major}"`,
            );
          }

          const cohort = cohortMap.get(dto.yearOfAdmission);
          if (!cohort) {
            throw new Error(
              `Không tìm thấy Cohort với mã "${dto.yearOfAdmission}"`,
            );
          }

          const classEntity = classMap.get(dto.class);
          if (!classEntity) {
            throw new BadRequestException(
              `Không tìm thấy lớp học với mã "${dto.class}"`,
            );
          }

          const currentCount = await this.usersRepository.count({
            where: { class: { id: classEntity.id } },
          });

          if (currentCount >= classEntity.maxCapacity) {
            throw new BadRequestException(
              `Lớp học "${dto.class}" đã đạt đến giới hạn (${classEntity.maxCapacity})`,
            );
          }

          const hashPassword = dto.password
            ? await getHashPassword(dto.password)
            : await getHashPassword('123456');

          const user = this.usersRepository.create({
            name: dto.name,
            email: dto.email,
            password: hashPassword,
            role: role,
            major: major,
            class: classEntity,
            yearOfAdmission: cohort,
          });

          countSuccess++;
          return user;
        } catch (error) {
          console.error(`Lỗi khi tạo user: ${error.message}`);
          countError++;
          return null;
        }
      }),
    );

    const validUsers = users.filter((user) => user !== null);
    const data = await this.usersRepository.save(validUsers);

    return {
      countSuccess: countSuccess,
      countError: countError,
      data: data,
    };
  }

  verifyCode = async (email: string) => {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    const codeId = Math.floor(10000 + Math.random() * 90000);

    const data = {
      name: user.name,
      codeId,
    };

    await this.mailService.sendMailRetryPassword(data);

    await this.usersRepository.update(
      { email },
      {
        codeID: codeId,
        codeExpired: dayjs().add(5, 'minutes').toDate(),
      },
    );

    return { id: user.id, email: user.email };
  };

  forgotPassword = async (data: ForgotPasswordAuthDto) => {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException(
        'Mật khẩu/ xác nhận mật khẩu không chính xác',
      );
    }

    const user = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    const isCodeExpired = dayjs().isAfter(user.codeExpired);
    if (isCodeExpired) {
      throw new BadRequestException('Mã khôi phục mật khẩu đã hết hạn');
    }

    const newPassword = await getHashPassword(data.password);
    await this.usersRepository.update(
      { id: user.id },
      { password: newPassword },
    );

    return { id: user.id, email: user.email };
  };

  changePassword =async (data: ChangePasswordAuthDto, user:IUser) => {
    const checkUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });
    if (!checkUser) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    if(checkUser.codeID !== +data.code){
      throw new BadRequestException('Mã xác nhận không chính xác / do hết hạn');
    }
    const isMatch = await isValidPassword(data.oldPassword,checkUser.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    if (data.password !== data.confirmPassword) {
      throw new BadRequestException(
        'Mật khẩu/ xác nhận mật khẩu không chính xác',
      );
    }

    const newPassword = await getHashPassword(data.password);
    return await this.usersRepository.update(
      { id: user.id },
      { password: newPassword },
    );
  }
}
