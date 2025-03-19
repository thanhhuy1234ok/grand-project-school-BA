import { Facility } from "src/modules_v2/facility/entities/facility.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FacilityCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Facility, (facility) => facility.category)
  facilities: Facility[];
}
