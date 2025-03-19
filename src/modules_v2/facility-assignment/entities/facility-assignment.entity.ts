import { Facility } from "src/modules_v2/facility/entities/facility.entity";
import { Room } from "src/room/entities/room.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FacilityAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Facility, (facility) => facility.assignments, {
    nullable: false,
  })
  facility: Facility;

  @ManyToOne(() => Room, (room) => room.assignments, { nullable: false })
  room: Room;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  @ManyToOne(() => User, (user) => user.assignments, { nullable: true })
  assignedBy: User;
}
