import { inject, injectable } from "tsyringe";

import { Coupon } from "@modules/coupons/infra/typeorm/entities/Coupon";
import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";

@injectable()
class ListAvailableCouponsUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: ICouponsRepository
  ) {}

  async execute(): Promise<Coupon[]> {
    const coupons = await this.couponsRepository.listAvailable();

    return coupons;
  }
}

export { ListAvailableCouponsUseCase };
