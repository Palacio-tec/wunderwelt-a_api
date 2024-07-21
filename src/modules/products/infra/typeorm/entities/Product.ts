import { Column, Entity, PrimaryColumn } from "typeorm";
import { randomUUID as uuidV4 } from 'crypto'
import { numberTransformer } from "@shared/infra/typeorm/transformers/numberTransformer";

@Entity("products")
class Product {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { transformer: numberTransformer })
  value: number;

  @Column('int', { transformer: numberTransformer })
  amount: number;

  @Column('int', { transformer: numberTransformer, nullable: true })
  original_amount: number;

  @Column('decimal', { transformer: numberTransformer, nullable: true })
  original_value: number;

  @Column({ default: false })
  is_active: boolean;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Product };
