import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateLevelUseCase } from "./UpdateLevelUseCase";

class UpdateLevelController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const {
      name,
      color,
      variant,
    } = request.body;
    const user_id = request.user.id;

    const updateLevelUseCase = container.resolve(UpdateLevelUseCase);

    const level = await updateLevelUseCase.execute(
      {
        id,
        name: name.toUpperCase(),
        color,
        variant,
      },
      user_id
    );

    return response.status(201).json(level);
  }
}

export { UpdateLevelController };
