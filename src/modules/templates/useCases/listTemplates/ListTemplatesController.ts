import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import { ListTemplatesUseCase } from "./ListTemplatesUseCase";

class ListTemplatesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listTemplatesUseCase = container.resolve(ListTemplatesUseCase);

    const templates = await listTemplatesUseCase.execute();

    return response.status(201).json(classToClass(templates));
  }
}

export { ListTemplatesController };
