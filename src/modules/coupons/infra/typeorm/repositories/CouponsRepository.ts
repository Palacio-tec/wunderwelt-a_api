import { ICreateCouponsDTO } from "@modules/coupons/dtos/ICreateCouponDTO";
import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";
import { format } from "date-fns";
import { getRepository, IsNull, Not, Repository } from "typeorm";
import { Coupon } from "../entities/Coupon";

class CouponsRepository implements ICouponsRepository {
  private repository: Repository<Coupon>;

  constructor() {
    this.repository = getRepository(Coupon);
  }

  async create({
    id,
    code,
    amount,
    limit,
    expiration_date,
    used,
  }: ICreateCouponsDTO): Promise<Coupon> {
    const coupon = this.repository.create({
      id,
      code,
      amount,
      limit,
      expiration_date,
      used,
    });

    await this.repository.save(coupon);

    return coupon;
  }

  async findAvailableByCode(code: string): Promise<Coupon[]> {
    const coupons = await this.repository.query(
      `SELECT c.* FROM coupons c
      WHERE
        c.code = '${code}'
        AND c.used < c.limit
        AND c.expiration_date >= '${format(new Date(), 'yyyy-MM-dd')}'`
    );

    return coupons;
  }

  async list(): Promise<Coupon[]> {
    const cupons = await this.repository.find();

    return cupons;
  }

  async findById(id: string): Promise<Coupon> {
    const coupon = await this.repository.findOne(id);

    return coupon;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAvailableByCodeForOtherId(id: string, code: string): Promise<Coupon[]> {
    const coupons = await this.repository.query(
      `SELECT c.* FROM coupons c
      WHERE
        c.id <> '${id}'
        AND c.code = '${code}'
        AND c.used < c.limit
        AND c.expiration_date >= '${format(new Date(), 'yyyy-MM-dd')}'`
    );

    return coupons
  }

  async findByFieldForOtherCoupon(field: string, value: string, id: string): Promise<Coupon[]> {
    const coupons = await this.repository.query(
      `SELECT c.* FROM coupons c
      WHERE
        c.id <> '${id}'
        AND c.${field} = '${value}'
        AND c.used < c.limit
        AND c.expiration_date >= '${format(new Date(), 'yyyy-MM-dd')}'`
    );

    return coupons;
  }

  async findByField(field: string, value: string): Promise<Coupon[]> {
    const coupons = await this.repository.query(
      `SELECT c.* FROM coupons c
      WHERE
        c.${field} = '${value}'
        AND c.used < c.limit
        AND c.expiration_date >= '${format(new Date(), 'yyyy-MM-dd')}'`
    );

    return coupons;
  }
}

export { CouponsRepository };
