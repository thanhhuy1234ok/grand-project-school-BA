import { Semester } from "src/semester/entities/semester.entity";
import { Subject } from "src/subject/entities/subject.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  student: User;

  @ManyToOne(() => Subject)
  subject: Subject;

  @ManyToOne(() => Semester)
  semester: Semester;

  @Column({ default: false })
  isPaid: boolean;

  @CreateDateColumn()
  registeredAt: Date;
}
