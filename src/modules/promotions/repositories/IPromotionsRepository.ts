import { ICreatePromotionsDTO } from "../dtos/ICreatePromotionsDTO";
import { Promotion } from "../infra/typeorm/entities/Promotion";

interface IPromotionsRepository {
  create(data: ICreatePromotionsDTO): Promise<Promotion>;
  findById(id: string): Promise<Promotion>;
  delete(id: string): Promise<void>;
  listAll(): Promise<Promotion[]>;
  findByDate(date: string): Promise<Promotion>;
  findByCouponId(couponId: string): Promise<Promotion[]>;
}

export { IPromotionsRepository };
