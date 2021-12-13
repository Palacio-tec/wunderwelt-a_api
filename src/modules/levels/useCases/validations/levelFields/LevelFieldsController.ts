import { Request, Response } from "express";
import { container } from "tsyringe";
import { LevelFieldsUseCase } from "./LevelFieldsUseCase";

class LevelFieldsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const field = String(request.query.field);
    const value = String(request.query.value);
    const level_id = request.query.level_id;

    const levelFieldsUseCase = container.resolve(LevelFieldsUseCase);

    const levelExists = await levelFieldsUseCase.execute(field, value, level_id as string);

    return response.status(201).json(levelExists);
  }
}

export { LevelFieldsController };
