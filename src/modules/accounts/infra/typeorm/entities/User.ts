import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { randomUUID as uuidV4 } from 'crypto'
import { Exclude } from "class-transformer";

import { Hours } from "./Hours";
import { Level } from "@modules/levels/infra/typeorm/entities/Level";
@Entity("users")
class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  is_admin: boolean;

  @Column()
  is_teacher: boolean;

  @Column()
  inactivation_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  street_name: string;

  @Column()
  street_number: string;

  @Column()
  zip_code: string;

  @Column()
  area_code: string;

  @Column()
  phone: string;

  @Column({ default: "CPF" })
  document_type: string = "CPF";

  @Column()
  document: string;

  @OneToMany(() => Hours, hours => hours.user)
  @JoinColumn() 
  hours: Hours;

  @Column({ default: 0})
  credit: number;

  @Column({ default: true })
  receive_newsletter: boolean

  @Column({ default: true })
  receive_email: boolean

  @Column({ default: false })
  is_company: boolean;

  @Column({ nullable: true })
  birth_date: Date

  @Column({ nullable: true })
  level_id: string

  @ManyToOne(() => Level)
  @JoinColumn({ name: "level_id" })
  level: Level;

  @Column({ nullable: true })
  our_student: boolean;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { User };
