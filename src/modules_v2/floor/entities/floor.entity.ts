import { Building } from 'src/modules_v2/building/entities/building.entity';
import { Room } from 'src/room/entities/room.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';


@Entity()
export class Floor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên tầng (Ví dụ: "Tầng 1", "Tầng 2")

  @ManyToOne(() => Building, (building) => building.floors, {
    nullable: false, 
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'buildingID' })
  building: Building;

  @Column()
  floorNumber: number; 

  @OneToMany(() => Room, (room) => room.floor, { cascade: true })
  rooms: Room[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
