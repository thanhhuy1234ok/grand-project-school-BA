import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FacilityStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
