import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class DayOfWeek {
  @PrimaryColumn()
  id: number;
  
  @Column()
  name: string; // Tên ngày trong tuần (VD: Thứ Hai)

  @OneToMany(() => Schedule, (schedule) => schedule.daysOfWeek)
  schedules: Schedule[];
}
