import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { Exclude } from "class-transformer";
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

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}

export { User };
