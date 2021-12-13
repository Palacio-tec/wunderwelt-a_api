import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateLevelUseCase } from "./CreateLevelUseCase";

class CreateLevelController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, color, variant } = request.body;
    const user_id = request.user.id;

    const createLevelUseCase = container.resolve(CreateLevelUseCase);

    const level = await createLevelUseCase.execute(
      {
        name: name.toUpperCase(),
        color,
        variant,
      },
      user_id
    );

    return response.status(201).json(level);
  }
}

export { CreateLevelController };
