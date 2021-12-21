import { v4 as uuidV4 } from "uuid";

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

@Entity("events")
class Event {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
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
  instruction: string;

  @Column()
  is_canceled: boolean;

  @Column()
  credit: number;

  @Column()
  request_subject: boolean;

  @Column()
  minimum_number_of_students: number;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Event };
