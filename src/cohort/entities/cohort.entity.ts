import { Semester } from 'src/semester/entities/semester.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class Cohort {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startYear: number;

  @Column()
  endYear: number;

  @OneToMany(() => User, (student) => student.yearOfAdmission, {
    nullable: true,
  })
  students: User[];

  @OneToMany(() => Semester, (semester) => semester.cohort)
  semesters: Semester[];
}
