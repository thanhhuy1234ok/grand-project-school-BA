import { FacilityAssignment } from "src/modules_v2/facility-assignment/entities/facility-assignment.entity";
import { FacilityCategory } from "src/modules_v2/facility-category/entities/facility-category.entity";
import { FacilityStatus } from "src/modules_v2/facility-status/entities/facility-status.entity";
import { MaintenanceHistory } from "src/modules_v2/maintenance-history/entities/maintenance-history.entity";
import { Supplier } from "src/modules_v2/supplier/entities/supplier.entity";
import { Room } from "src/room/entities/room.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Facility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => FacilityCategory, (category) => category.facilities, {
    nullable: false,
  })
  category: FacilityCategory;

  @ManyToOne(() => FacilityStatus, (status) => status.facilities, {
    nullable: false,
  })
  status: FacilityStatus;

  @ManyToOne(() => Room, (room) => room.facilities, { nullable: true })
  room: Room;

  @ManyToOne(() => Supplier, (supplier) => supplier.facilities, {
    nullable: true,
  })
  supplier: Supplier;

  @Column({ type: 'date' })
  purchaseDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'date', nullable: true })
  warrantyExpiry: Date;

  @OneToMany(() => FacilityAssignment, (assignment) => assignment.facility)
  assignments: FacilityAssignment[];

  @OneToMany(() => MaintenanceHistory, (history) => history.facility)
  maintenanceRecords: MaintenanceHistory[];
}
