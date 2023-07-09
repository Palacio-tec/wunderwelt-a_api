import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { randomUUID as uuidV4 } from 'crypto'

@Entity("parameters")
class Parameter {
  @PrimaryColumn()
  id: string;

  @Column()
  reference: string;

  @Column()
  description: string;

  @Column()
  value: string;

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

export { Parameter };
