import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DayOfWeek {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên ngày trong tuần (VD: Thứ Hai)

  @OneToMany(() => Schedule, (schedule) => schedule.daysOfWeek)
  schedules: Schedule[];
}
