import { Column, Entity, PrimaryColumn } from "typeorm";
import { randomUUID as uuidV4 } from 'crypto'

@Entity("products")
class Product {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  value: number;

  @Column()
  amount: number;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Product };
