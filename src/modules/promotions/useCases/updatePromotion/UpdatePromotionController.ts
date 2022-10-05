import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdatePromotionUseCase } from "./UpdatePromotionUseCase";

class UpdatePromotionController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const {
        message,
        coupon_id,
        promotion_date,
    } = request.body;
    const { id: user_id } = request.user;

    const updatePromotionUseCase = container.resolve(UpdatePromotionUseCase);

    const event = await updatePromotionUseCase.execute(
      {
        id,
        message,
        coupon_id,
        promotion_date,
        user_id,
      }
    );

    return response.status(201).send(event);
  }
}

export { UpdatePromotionController };
