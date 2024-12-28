import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Cohort } from 'src/cohort/entities/cohort.entity';
import { Major } from 'src/major/entities/major.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Score } from 'src/score/entities/score.entity';
import { UpdateInfoUser } from 'src/update_info_user/entities/update_info_user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => Role, { nullable: true, eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Cohort, (cohort) => cohort.students, {
    nullable: true,
    eager: true,
  })
  yearOfAdmission: Cohort;

  @ManyToOne(() => Major, (major) => major.users, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'major_id' })
  major: Major;

  @ManyToOne(() => Class, (classEntity) => classEntity.students, {
    nullable: true,
  })
  class: Class | null;

  @OneToMany(() => Schedule, (schedule) => schedule.teacher)
  schedules: Schedule[];

  @OneToMany(() => Attendance, (attendance) => attendance.student, {
    nullable: true,
  })
  attendances: Attendance[];

  @OneToMany(() => Score, (score) => score.student)
  scores: Score[];

  @OneToMany(() => UpdateInfoUser, (updateRequest) => updateRequest.user)
  updateRequests: UpdateInfoUser[];

  /** Column Token */
  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  codeID: number;

  @Column({ type: 'timestamp', nullable: true })
  codeExpired: Date;

  /** Column Active */
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
