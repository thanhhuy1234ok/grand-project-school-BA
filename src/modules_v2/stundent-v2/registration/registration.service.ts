import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { Registration } from './entities/registration.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/helpers/types/user.interface';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>
  ) {

  }

  async create(createRegistrationDto: CreateRegistrationDto , user:IUser) {
    const { semesterId, subjectIds } = createRegistrationDto;

    // 1. Lấy danh sách các môn sinh viên đã đăng ký trong kỳ này
    const existingRegistrations = await this.registrationRepository.find({
      where: {
        student: { id: user.id },
        semester: { id: semesterId },
      },
      relations: ['subject'],
    });

    const existingSubjectIds = existingRegistrations.map((r) => r.subject.id);

    // 2. Lọc ra các môn chưa đăng ký
    const newSubjectIds = subjectIds.filter(
      (id) => !existingSubjectIds.includes(id),
    );

    if (newSubjectIds.length === 0) {
      throw new BadRequestException('Bạn đã đăng ký tất cả các môn đã chọn.');
    }

    // 3. Tạo danh sách bản ghi mới
    const newRegistrations = newSubjectIds.map((subjectId) =>
      this.registrationRepository.create({
        student: { id: user.id },
        subject: { id: subjectId },
        semester: { id: semesterId },
        isPaid: false,
      }),
    );

    // 4. Lưu vào DB
    const result = await this.registrationRepository.save(newRegistrations);

    return {
      message: 'Đăng ký môn học thành công!',
      data: result,
    };
  }

  findAll() {
    return `This action returns all registration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registration`;
  }

  update(id: number, updateRegistrationDto: UpdateRegistrationDto) {
    return `This action updates a #${id} registration`;
  }

  remove(id: number) {
    return `This action removes a #${id} registration`;
  }
}
