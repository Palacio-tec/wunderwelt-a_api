import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";
import { IPromotionsRepository } from "@modules/promotions/repositories/IPromotionsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IDeleteCoupon {
  id: string;
  user_id: string;
}

@injectable()
class DeleteCouponUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: ICouponsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("PromotionsRepository")
    private promotionsRepository: IPromotionsRepository,
  ) {}

  async execute({ id, user_id }: IDeleteCoupon): Promise<void> {
    const coupon = await this.couponsRepository.findById(id);

    if (!coupon) {
      throw new AppError("Coupon does not exists");
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User does not exists");
    }

    if (!user.is_admin) {
      throw new AppError("User is not admin");
    }

    const hasPromotions = await this.promotionsRepository.findByCouponId(id)

    hasPromotions.forEach(async (promotion) => {
      await this.promotionsRepository.delete(promotion.id)
    })

    await this.couponsRepository.deleteById(id);
  }
}

export { DeleteCouponUseCase };
