import { DayOfWeek } from "src/day-of-week/entities/day-of-week.entity";
import { Room } from "src/room/entities/room.entity";
import { Semester } from "src/semester/entities/semester.entity";
import { Subject } from "src/subject/entities/subject.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Lesson } from "../../lesson/entities/lesson.entity";

@Entity()
export class ClassSchedule {
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

  @ManyToOne(() => Semester, (semester) => semester.schedules, {
    nullable: true,
  })
  @JoinColumn({ name: 'semester_id' })
  semester: Semester;

  @OneToMany(() => Lesson, (lesson) => lesson.classSchedule)
  lessons: Lesson[];
}
