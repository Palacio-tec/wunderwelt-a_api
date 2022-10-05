import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { randomUUID as uuidV4 } from "crypto";

import { Coupon } from "@modules/coupons/infra/typeorm/entities/Coupon";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

@Entity("promotions")
class Promotion {
  @PrimaryColumn()
  id: string;

  @Column()
  message: string;

  @Column()
  coupon_id: string;

  @ManyToOne(() => Coupon)
  @JoinColumn({ name: "coupon_id" })
  coupon: Coupon;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  promotion_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Promotion };
