import { inject, injectable } from "tsyringe";

import { Coupon } from "@modules/coupons/infra/typeorm/entities/Coupon";
import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";

@injectable()
class ListCouponsUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: ICouponsRepository
  ) {}

  async execute(): Promise<Coupon[]> {
    const coupons = await this.couponsRepository.list();

    return coupons;
  }
}

export { ListCouponsUseCase };
