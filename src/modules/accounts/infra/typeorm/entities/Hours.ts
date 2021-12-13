import { v4 as uuidV4 } from "uuid";

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
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
