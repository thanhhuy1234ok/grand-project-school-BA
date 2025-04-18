import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Enrollment } from "../../enrollment/entities/enrollment.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Enrollment, (enrollment) => enrollment.payment)
  enrollment: Enrollment;

  @Column()
  method: string; // e.g., 'paypal', 'bank', etc.

  @Column()
  status: 'PENDING' | 'SUCCESS' | 'FAILED';

  @Column({ type: 'int' })
  amount: number;

  @CreateDateColumn()
  paidAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expireAt: Date;
}
