import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import { ListPromotionsUseCase } from "./ListPromotionsUseCase";

class ListPromotionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listPromotionsUseCase = container.resolve(ListPromotionsUseCase);

    const promotions = await listPromotionsUseCase.execute();

    return response.status(201).json(classToClass(promotions));
  }
}

export { ListPromotionsController };
