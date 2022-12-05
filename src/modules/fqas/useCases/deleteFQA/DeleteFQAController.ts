import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteFQAUseCase } from "./DeleteFQAUseCase";

class DeleteFQAController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const user_id = request.user.id;

    const deleteFQAUseCase = container.resolve(DeleteFQAUseCase);

    await deleteFQAUseCase.execute(id, user_id);

    return response.status(201).send();
  }
}

export { DeleteFQAController };
