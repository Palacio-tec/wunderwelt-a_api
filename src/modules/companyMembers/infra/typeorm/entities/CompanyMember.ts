import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { randomUUID as uuidV4 } from 'crypto'
import { User } from "@modules/accounts/infra/typeorm/entities/User";

@Entity("company_members")
class CompanyMember {
  @PrimaryColumn()
  id: string;

  @Column()
  user_id: string;

  @Column()
  company_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "company_id" })
  company: User;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { CompanyMember };
