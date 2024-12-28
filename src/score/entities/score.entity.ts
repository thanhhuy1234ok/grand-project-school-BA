import { Semester } from 'src/semester/entities/semester.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float', { nullable: true, default: 0 })
  attendanceScore: number; // Điểm chuyên cần

  @Column('float', { nullable: true, default: 0 })
  midtermScore: number; // Điểm giữa kỳ

  @Column('float', { nullable: true, default: 0 })
  finalScore: number; // Điểm cuối kỳ

  @ManyToOne(() => User, (user) => user.scores)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Subject, (subject) => subject.scores)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => Semester, (semester) => semester.id)
  semester: Semester;
}
