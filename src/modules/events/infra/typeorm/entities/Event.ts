import { v4 as uuidV4 } from "uuid";

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Exclude } from "class-transformer";
import { EventLevels } from "./EventsLevels";

@Entity("events")
class Event {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  @Exclude()
  link: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  student_limit: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  teacher_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "teacher_id" })
  user: User;

  @Column()
  @Exclude()
  instruction: string;

  @Column()
  is_canceled: boolean;

  @Column()
  credit: number;

  @Column()
  request_subject: boolean;

  @Column()
  minimum_number_of_students: number;

  @Column()
  has_highlight: boolean;

  @OneToMany(() => EventLevels, eventLevels => eventLevels.event)
  @JoinColumn({ name: 'id' })
  event_levels: EventLevels[];

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Event };
