import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { LessThan, Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import dayjs from 'dayjs';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,

    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  async cancelExpiredPayments() {
    const now = dayjs().toDate();

    const expiredPayments = await this.paymentRepo.find({
      where: {
        status: 'PENDING',
        expireAt: LessThan(now),
      },
      relations: ['enrollment'],
    });

    let count = 0;

    for (const payment of expiredPayments) {
      payment.status = 'FAILED';
      await this.paymentRepo.save(payment);

      const enrollment = payment.enrollment;
      if (enrollment) {
        await this.enrollmentRepo.remove(enrollment);
        count++;
      }
    }

    return {
      message: `🕓 Đã huỷ ${count} đơn đăng ký quá hạn chưa thanh toán.`,
    };
  }
  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
