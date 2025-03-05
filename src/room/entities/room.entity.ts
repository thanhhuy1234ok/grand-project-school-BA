import { Building } from 'src/modules_v2/building/entities/building.entity';
import { Floor } from 'src/modules_v2/floor/entities/floor.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; 

  @ManyToOne(() => Building, (building) => building.rooms, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'buildingID' })
  building: Building; // Mỗi phòng thuộc một tòa nhà

  @ManyToOne(() => Floor, (floor) => floor.rooms, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'floorID' })
  floor: Floor | null; 

  @Column('int')
  capacity: number;

  @Column({
    type: 'enum',
    enum: ['Available', 'Occupied', 'Under Maintenance'],
    default: 'Available',
  })
  status: 'Available' | 'Occupied' | 'Under Maintenance'; 

  @OneToMany(() => Schedule, (schedule) => schedule.room)
  schedules: Schedule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
