import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lesson } from "../../lesson/entities/lesson.entity";

@Entity()
export class AttendanceV1 {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.attendances)
  lesson: Lesson;

//   @ManyToOne(() => Enrollment)
//   enrollment: Enrollment;

  @Column({ default: 'absent' })
  status: 'present' | 'absent' | 'late';

  @Column({ nullable: true })
  note: string;
}
