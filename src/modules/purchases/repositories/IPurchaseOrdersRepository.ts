import { ICreatePurchaseOrdersDTO } from "../dtos/ICreatePurchaseOrdersDTO";
import { PurchaseOrder } from "../infra/typeorm/entities/PurchaseOrder";

interface IPurchaseOrdersRepository {
  create(data: ICreatePurchaseOrdersDTO): Promise<PurchaseOrder>;
  findByPaymentId(payment_id: string): Promise<PurchaseOrder>;
}

export { IPurchaseOrdersRepository };
