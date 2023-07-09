import { randomUUID as uuidV4 } from 'crypto'

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

@Entity("schedules")
class Schedule {
  @PrimaryColumn()
  id: string;

  @Column()
  event_id: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: "event_id" })
  event: Event;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  subject: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Schedule };
