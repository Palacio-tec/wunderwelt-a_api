import { Request, Response } from "express";
import { container } from "tsyringe";

import { FindPromotionUseCase } from "./FindPromotionUseCase";

class FindPromotioController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const findPromotionUseCase = container.resolve(FindPromotionUseCase);

    const promotion = await findPromotionUseCase.execute(id);

    return response.status(201).json(promotion);
  }
}

export { FindPromotioController };
