import { inject, injectable } from "tsyringe";

import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CouponFieldsUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: ICouponsRepository
  ) {}

  async execute(field: string, value: string, id?: string): Promise<boolean> {
    if (field !== 'code') {
      throw new AppError('Field cannot be found.')
    }

    if (field === 'code') {
      value = value.toUpperCase()
    }

    let coupons = []

    if (id !== undefined) {
      coupons = await this.couponsRepository.findByFieldForOtherCoupon(field, value, String(id));
    } else {
      coupons = await this.couponsRepository.findByField(field, value);
    }

    const inUse = coupons.length > 0

    return inUse;
  }
}

export { CouponFieldsUseCase };
