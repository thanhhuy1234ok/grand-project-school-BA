import { Facility } from "src/modules_v2/facility/entities/facility.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MaintenanceHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Facility, (facility) => facility.maintenanceRecords, {
    nullable: false,
  })
  facility: Facility;

  @Column({ type: 'date' })
  maintenanceDate: Date;

  @Column()
  maintenanceType: string; // Bảo trì định kỳ, Sửa chữa, v.v.

  @ManyToOne(() => User, (user) => user.maintenanceRecords, { nullable: true })
  technician: User;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
