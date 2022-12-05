import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import { ListFQAsUseCase } from "./ListFQAsUseCase";

class ListFQAsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listFQASsUseCase = container.resolve(ListFQAsUseCase);

    const fqas = await listFQASsUseCase.execute();

    return response.status(201).json(classToClass(fqas));
  }
}

export { ListFQAsController };
