import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreatePromotionUseCase } from "./CreatePromotionUseCase";

class CreatePromotionController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
        message,
        coupon_id,
        promotion_date,
    } = request.body;
    const { id: user_id } = request.user;

    const createPromotionUseCase = container.resolve(CreatePromotionUseCase);

    const promotion = await createPromotionUseCase.execute({
        message,
        coupon_id,
        promotion_date,
        user_id,
    });

    return response.status(201).json(promotion);
  }
}

export { CreatePromotionController };
