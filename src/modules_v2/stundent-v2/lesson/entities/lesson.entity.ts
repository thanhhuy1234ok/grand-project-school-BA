import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClassSchedule } from "../../class-schedule/entities/class-schedule.entity";
import { AttendanceV1 } from "../../attendance-v1/entities/attendance-v1.entity";

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  name: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: false })
  isCancelled: boolean;

  @ManyToOne(() => ClassSchedule, (classSchedule) => classSchedule.lessons)
  classSchedule: ClassSchedule;

  @OneToMany(() => AttendanceV1, (attendanceV1) => attendanceV1.lesson)
  attendances: AttendanceV1[];
}
