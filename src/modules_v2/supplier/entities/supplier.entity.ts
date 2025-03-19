import { Facility } from 'src/modules_v2/facility/entities/facility.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  contactInfo: string;

  @OneToMany(() => Facility, (facility) => facility.supplier)
  facilities: Facility[];
}
