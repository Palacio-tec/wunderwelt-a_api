import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { randomUUID as uuidV4 } from "crypto";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

@Entity("templates")
class Template {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  subject: string;

  @Column()
  body: string;

  @Column()
  version: number;

  @Column()
  template: string;

  @Column({ nullable: true })
  layout: string;

  @Column({ nullable: true })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
    if (!this.is_active) {
      this.is_active = true;
    }
  }
}

export { Template };
