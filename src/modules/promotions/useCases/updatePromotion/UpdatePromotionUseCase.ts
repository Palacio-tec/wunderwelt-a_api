import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";
import { IPromotionsRepository } from "@modules/promotions/repositories/IPromotionsRepository";
import { ICreatePromotionsDTO } from "@modules/promotions/dtos/ICreatePromotionsDTO";
import { Promotion } from "@modules/promotions/infra/typeorm/entities/Promotion";
import { AppError } from "@shared/errors/AppError";

@injectable()
class UpdatePromotionUseCase {
  constructor(
    @inject("PromotionsRepository")
    private promotionsRepository: IPromotionsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CouponsRepository")
    private couponsRepository: ICouponsRepository
  ) {}

  async execute(
    {
        id,
        message,
        coupon_id,
        promotion_date,
        user_id,
    }: ICreatePromotionsDTO,
  ): Promise<Promotion> {
    const couponExists = await this.couponsRepository.findById(coupon_id)

    if (!couponExists) {
        throw new AppError(
            "Coupon does not exists."
        );
    }

    const userExists = await this.usersRepository.findById(user_id)

    if (!userExists) {
        throw new AppError(
            "User does not exists."
        );
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be update an event");
    }

    const promotion = await this.promotionsRepository.create({
        id,
        message,
        coupon_id,
        promotion_date,
        user_id,
    });

    return promotion;
  }
}

export { UpdatePromotionUseCase };
