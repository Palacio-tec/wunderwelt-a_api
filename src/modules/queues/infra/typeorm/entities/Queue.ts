import { randomUUID as uuidV4 } from 'crypto'

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Event } from "@modules/events/infra/typeorm/entities/Event";

@Entity("queues")
class Queue {
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

  @Column()
  sugestion: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Queue };
