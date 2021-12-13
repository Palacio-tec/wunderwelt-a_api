import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteLevelUseCase } from "./DeleteLevelUseCase";

class DeleteLevelController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const user_id = request.user.id;

    const deleteLevelUseCase = container.resolve(DeleteLevelUseCase);

    await deleteLevelUseCase.execute(id, user_id);

    return response.status(201).send();
  }
}

export { DeleteLevelController };
