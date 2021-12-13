import { Request, Response } from "express";
import { container } from "tsyringe";
import { CanDeleteLevelUseCase } from "./CanDeleteLevelUseCase";

class CanDeleteLevelController {
  async handle(request: Request, response: Response): Promise<Response> {
    const level_id = String(request.query.level_id);

    const canDeleteLevelUseCase = container.resolve(CanDeleteLevelUseCase);

    const validation = await canDeleteLevelUseCase.execute(level_id);

    return response.status(201).json(validation);
  }
}

export { CanDeleteLevelController };
