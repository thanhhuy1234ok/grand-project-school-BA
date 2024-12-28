import { Schedule } from 'src/schedule/entities/schedule.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  maxCapacity: number;

  @OneToMany(() => User, (user) => user.class)
  students: User[];

  @OneToMany(() => Schedule, (schedule) => schedule.class)
  schedules: Schedule[];
}
