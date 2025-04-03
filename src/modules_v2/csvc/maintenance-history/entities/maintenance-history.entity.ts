
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Facility } from '../../facility/entities/facility.entity';
import { MaintenanceStatus } from 'src/helpers/enum/enum.global';
import { Room } from 'src/room/entities/room.entity';

@Entity()
export class MaintenanceHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  maintenanceDate: Date;

  @Column()
  maintenanceType: string; // Bảo trì định kỳ, Sửa chữa, v.v.

  @ManyToOne(() => Facility, { eager: true })
  @JoinColumn({ name: 'facility_id' })
  facility: Facility;

  @ManyToOne(()=> Room , { eager: true })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'technician_id' })
  technician: User;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;
  
  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.PENDING,
  })
  status: MaintenanceStatus;
}
