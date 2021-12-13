import { inject, injectable } from "tsyringe";

import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";
import { AppError } from "@shared/errors/AppError";

type Coupon = {
  code: string;
  amount: number;
  limit: number;
  expiration_date: Date;
  used: number;
};

@injectable()
class FindCouponUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: ICouponsRepository,
  ) {}

  async execute(id: string): Promise<Coupon> {
    const couponIdExists = await this.couponsRepository.findById(id);

    if (!couponIdExists) {
      throw new AppError("Coupon does not exists");
    }

    const {
      code,
      amount,
      limit,
      expiration_date,
      used,
    } = await this.couponsRepository.findById(id);

    return {
      code,
      amount,
      limit,
      expiration_date,
      used,
    };
  }
}

export { FindCouponUseCase };
