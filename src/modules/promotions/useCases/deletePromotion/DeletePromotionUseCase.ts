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
class DeletePromotionUseCase {
  constructor(
    @inject("PromotionsRepository")
    private promotionsRepository: IPromotionsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ id, user_id }: IDeleteCoupon): Promise<void> {
    const promotion = await this.promotionsRepository.findById(id);

    if (!promotion) {
      throw new AppError("Promotion does not exists");
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User does not exists");
    }

    if (!user.is_admin) {
      throw new AppError("User is not admin");
    }

    await this.promotionsRepository.delete(id);

    return
  }
}

export { DeletePromotionUseCase };
