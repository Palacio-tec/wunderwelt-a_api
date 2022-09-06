import { inject, injectable } from "tsyringe";

import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";
import { AppError } from "@shared/errors/AppError";
import { Coupon } from "@modules/coupons/infra/typeorm/entities/Coupon";

@injectable()
class AvailableCouponUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: ICouponsRepository,
  ) {}

  async execute(code: string): Promise<Coupon> {
    const coupon = await this.couponsRepository.findAvailableByCode(code);

    if (!coupon) {
      throw new AppError("Coupon not available");
    }

    return coupon
  }
}

export { AvailableCouponUseCase };
