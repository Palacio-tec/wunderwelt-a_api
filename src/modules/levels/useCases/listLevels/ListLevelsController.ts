import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import { ListLevelsUseCase } from "./ListLevelsUseCase";

class ListLevelsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listLevelsUseCase = container.resolve(ListLevelsUseCase);

    const levels = await listLevelsUseCase.execute();

    return response.status(201).json(classToClass(levels));
  }
}

export { ListLevelsController };
