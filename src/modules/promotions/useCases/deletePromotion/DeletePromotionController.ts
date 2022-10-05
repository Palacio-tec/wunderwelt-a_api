import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeletePromotionUseCase } from "./DeletePromotionUseCase";

class DeletePromotionController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const user_id = request.user.id;

    const deletePromotionUseCase = container.resolve(DeletePromotionUseCase);

    await deletePromotionUseCase.execute({ id: String(id), user_id });

    return response.status(201).send();
  }
}

export { DeletePromotionController };
