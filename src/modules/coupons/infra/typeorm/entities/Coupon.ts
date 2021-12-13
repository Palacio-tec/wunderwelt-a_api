import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("coupons")
class Coupon {
  @PrimaryColumn()
  id: string;

  @Column()
  code: string;

  @Column()
  amount: number;

  @Column()
  limit: number;

  @Column()
  expiration_date: Date;

  @Column()
  used: number;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Coupon };
