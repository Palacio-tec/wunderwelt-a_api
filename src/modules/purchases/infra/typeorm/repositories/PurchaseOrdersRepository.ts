// import { getRepository, Repository } from "typeorm";

import { getRepository, Repository } from "typeorm";

import { ICreatePurchaseOrdersDTO } from "@modules/purchases/dtos/ICreatePurchaseOrdersDTO";
import { IPurchaseOrdersRepository } from "@modules/purchases/repositories/IPurchaseOrdersRepository";

import { PurchaseOrder } from "../entities/PurchaseOrder";

class PurchaseOrdersRepository implements IPurchaseOrdersRepository {
  private repository: Repository<PurchaseOrder>;

  constructor() {
    this.repository = getRepository(PurchaseOrder);
  }

  async create({
    id,
    payment_id,
    status,
    status_detail,
    payer_id,
    product_id,
    value,
    credit,
  }: ICreatePurchaseOrdersDTO): Promise<any> {
    const purchaseOrder = this.repository.create({
      id,
      payment_id,
      status,
      status_detail,
      payer_id,
      product_id,
      value,
      credit,
    });
    
    await this.repository.save(purchaseOrder);

    return purchaseOrder;
  }
  
  async findByPaymentId(payment_id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.repository.findOne({payment_id});

    return purchaseOrder;
  }
}

export { PurchaseOrdersRepository };
