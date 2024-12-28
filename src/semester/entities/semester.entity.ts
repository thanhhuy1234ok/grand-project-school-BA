import { Cohort } from 'src/cohort/entities/cohort.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Semester {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên học kỳ (VD: "Học kỳ 1", "Học kỳ 2")

  @Column('date')
  startDate: Date; // Ngày bắt đầu học kỳ

  @Column('date')
  endDate: Date; // Ngày kết thúc học kỳ

  @Column({ default: true })
  isMainSemester: boolean;

  @Column({ type: 'int', nullable: true, default: 3 })
  minCredits?: number;

  @Column({ type: 'int', nullable: true })
  maxCredits?: number;

  @Column({ default: 0 })
  status: number; // 0: mở đăng ký, 1: đăng học, -1 đã kết thúc

  @ManyToOne(() => Cohort, (cohort) => cohort.semesters, { nullable: false })
  @JoinColumn({ name: 'cohort_id' })
  cohort: Cohort;

  @OneToMany(() => Schedule, (schedule) => schedule.semester)
  schedules: Schedule[];
}
