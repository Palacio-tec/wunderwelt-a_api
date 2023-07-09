import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Product } from "@modules/products/infra/typeorm/entities/Product";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { randomUUID as uuidV4 } from 'crypto'

@Entity("purchase_orders")
class PurchaseOrder {
  @PrimaryColumn()
  id: string;

  @Column()
  payment_id: string;

  @Column()
  status: string;

  @Column()
  status_detail: string;

  @Column()
  product_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column()
  value: number;

  @Column()
  credit: number;

  @Column()
  payer_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "payer_id" })
  user: User;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { PurchaseOrder };
