import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('int')
  capacity: number;

  @OneToMany(() => Schedule, (schedule) => schedule.room)
  schedules: Schedule[];
}
