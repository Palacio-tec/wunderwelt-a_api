import { inject, injectable } from "tsyringe";

import { IPromotionsRepository } from "@modules/promotions/repositories/IPromotionsRepository";
import { Promotion } from "@modules/promotions/infra/typeorm/entities/Promotion";

@injectable()
class ListPromotionsUseCase {
  constructor(
    @inject("PromotionsRepository")
    private promotionsRepository: IPromotionsRepository
  ) {}

  async execute(): Promise<Promotion[]> {
    const promotions = await this.promotionsRepository.listAll();

    return promotions;
  }
}

export { ListPromotionsUseCase };
