import { randomUUID as uuidV4 } from 'crypto'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import { Hours } from "@modules/accounts/infra/typeorm/entities/Hours";

import { Schedule } from "./Schedule";

@Entity("schedules_credits")
class ScheduleCredit {
  @PrimaryColumn()
  id: string;

  @Column()
  schedule_id: string;

  @ManyToOne(() => Schedule)
  @JoinColumn({ name: "schedule_id" })
  schedule: Schedule;

  @Column()
  credit_id: string;

  @ManyToOne(() => Hours)
  @JoinColumn({ name: "credit_id" })
  credit: Hours;

  @Column({ nullable: false })
  amount_credit: Number;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { ScheduleCredit };
