import { Facility } from "src/modules_v2/facility/entities/facility.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FacilityStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Facility, (facility) => facility.status)
  facilities: Facility[];
}
