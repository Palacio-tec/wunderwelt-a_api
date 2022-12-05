import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateFQAUseCase } from "./UpdateFQAUseCase";

class UpdateFQAController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const {
      title,
      description,
      embed_id,
    } = request.body;
    const user_id = request.user.id;

    const updateFQAUseCase = container.resolve(UpdateFQAUseCase);

    const fqa = await updateFQAUseCase.execute(
      {
        id,
        title,
        description,
        embed_id,
      },
      user_id
    );

    return response.status(201).json(fqa);
  }
}

export { UpdateFQAController };
