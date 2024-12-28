import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Class } from 'src/classes/entities/class.entity';
import { DayOfWeek } from 'src/day-of-week/entities/day-of-week.entity';
import { Room } from 'src/room/entities/room.entity';
import { Semester } from 'src/semester/entities/semester.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @ManyToOne(() => Room, (room) => room.schedules)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, (teacher) => teacher.schedules)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToMany(() => DayOfWeek, (dayOfWeek) => dayOfWeek.schedules, {
    nullable: true,
  })
  @JoinTable()
  daysOfWeek: DayOfWeek[];

  @ManyToOne(() => Subject, (subject) => subject.schedules)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => Class, (classEntity) => classEntity.schedules)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @OneToMany(() => Attendance, (attendance) => attendance.schedule)
  attendances: Attendance[];

  @ManyToOne(() => Semester, (semester) => semester.schedules, {
    nullable: true,
  })
  @JoinColumn({ name: 'semester_id' })
  semester: Semester;
}
