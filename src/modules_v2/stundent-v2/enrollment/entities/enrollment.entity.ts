import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClassSchedule } from "../../class-schedule/entities/class-schedule.entity";
import { Payment } from "../../payment/entities/payment.entity";
import { EnrollmentStatus } from "src/helpers/enum/enum.global";

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  student: User;

  @ManyToOne(() => ClassSchedule)
  classSchedule: ClassSchedule;

  @CreateDateColumn()
  enrolledAt: Date;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.PENDING,
  })
  status: EnrollmentStatus;

  @Column({ default: false })
  isPaid: boolean;

  @OneToOne(() => Payment, (payment) => payment.enrollment, { nullable: true })
  @JoinColumn()
  payment: Payment;
}
