import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Major {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Tên chuyên ngành

  @Column({ unique: true })
  code: string;

  @OneToMany(() => User, (user) => user.major)
  users: User[];
}
