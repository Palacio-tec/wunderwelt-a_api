import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { randomUUID as uuidV4 } from 'crypto'

import { User } from "./User";

@Entity("hours")
class Hours {
  @PrimaryColumn()
  id: string;

  @Column()
  amount: number;

  @Column()
  expiration_date: Date;

  @Column()
  user_id: string;

  @Column()
  balance: number;

  @Column()
  purchase_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Hours };
