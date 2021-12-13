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

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Statement };
