import { Schedule } from 'src/schedule/entities/schedule.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.attendances, {
    nullable: false,
  })
  schedule: Schedule;

  @ManyToOne(() => User, (user) => user.attendances, { nullable: false })
  student: User;

  @Column()
  date: Date;

  @Column({ default: false })
  isPresent: boolean;
}
