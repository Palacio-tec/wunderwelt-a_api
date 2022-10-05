import { inject, injectable } from "tsyringe";

import { IPromotionsRepository } from "@modules/promotions/repositories/IPromotionsRepository";
import { AppError } from "@shared/errors/AppError";

type IPromotion = {
    id: string;
    message: string;
    coupon_id: string;
    promotion_date: Date;
};

@injectable()
class FindPromotionUseCase {
  constructor(
    @inject("PromotionsRepository")
    private promotionsRepository: IPromotionsRepository,
  ) {}

  async execute(id: string): Promise<IPromotion> {
    const promotionExists = await this.promotionsRepository.findById(id);

    if (!promotionExists) {
      throw new AppError("Promotion does not exists");
    }

    const promotion = await this.promotionsRepository.findById(id);

    return promotion;
  }
}

export { FindPromotionUseCase };
