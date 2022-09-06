import { ICreateCouponsDTO } from "../dtos/ICreateCouponDTO";
import { Coupon } from "../infra/typeorm/entities/Coupon";

interface ICouponsRepository {
  create(date: ICreateCouponsDTO): Promise<Coupon>;
  findAvailableByCode(code: string): Promise<Coupon>;
  list(): Promise<Coupon[]>;
  findById(id: string): Promise<Coupon>;
  deleteById(id: string): Promise<void>;
  findAvailableByCodeForOtherId(id: string, code: string): Promise<Coupon[]>;
  findByFieldForOtherCoupon(field: string, value: string, id: string): Promise<Coupon[]>;
  findByField(field: string, value: string): Promise<Coupon[]>;
}

export { ICouponsRepository };
