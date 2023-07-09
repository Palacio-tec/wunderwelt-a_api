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
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";

@Entity("statements")
class Statement {
  @PrimaryColumn()
  id: string;

  @Column()
  user_id: string;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column({ type: "enum", enum: OperationEnumTypeStatement })
  type: OperationEnumTypeStatement;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  operation_date: Date;

  @Column({ default: false })
  is_gift: boolean;

  @Column()
  payment_id: string;

  @Column()
  origin: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Statement };
