import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Score } from 'src/score/entities/score.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // Mã môn học

  @Column()
  name: string; // Tên môn học

  @Column({ nullable: true, default: 3 })
  credits: number;

  @Column()
  type: string;

  @Column({ nullable: true })
  price: number; // Giá môn học

  @OneToMany(() => Schedule, (schedule) => schedule.subject)
  schedules: Schedule[];

  @OneToMany(() => Score, (score) => score.subject)
  scores: Score[];
}
