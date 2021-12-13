import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IConsumeCouponsDTO } from "@modules/coupons/dtos/IConsumeCouponDTO";
import { Coupon } from "@modules/coupons/infra/typeorm/entities/Coupon";
import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class ConsumeCouponUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CouponsRepository")
    private couponsRepository: ICouponsRepository,
  ) {}

  async execute({ code, user_id }: IConsumeCouponsDTO): Promise<Coupon> {
    const coupons = await this.couponsRepository.findAvailableByCode(code.toUpperCase());
  
    if (coupons.length <= 0) {
      throw new AppError("Coupon not available");
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User does not exists");
    }

    const coupon = coupons[0];

    coupon.used = Number(coupon.used) + 1

    await this.couponsRepository.create(coupon);

    return coupon;
  }
}

export { ConsumeCouponUseCase };
