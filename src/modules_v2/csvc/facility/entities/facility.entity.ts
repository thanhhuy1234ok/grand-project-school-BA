import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FacilityCategory } from "../../facility-category/entities/facility-category.entity";
import { FacilityStatus } from "../../facility-status/entities/facility-status.entity";
import { Supplier } from "../../supplier/entities/supplier.entity";
import { FacilityAssignment } from "../../facility-assignment/entities/facility-assignment.entity";

@Entity()
export class Facility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => FacilityCategory, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: FacilityCategory;

  @ManyToOne(() => FacilityStatus, { eager: true })
  @JoinColumn({ name: 'status_id' })
  status: FacilityStatus;

  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'date', nullable: true })
  purchase_date: Date;

  @Column({ type: 'date', nullable: true })
  warranty_expiry: Date;

  @Column('int')
  quantity: number;
  
  @Column({ name: 'remaining_quantity', type: 'int', default: 0 })
  remainingQuantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => FacilityAssignment, (assignment) => assignment.facility)
  assignments: FacilityAssignment[];
}
