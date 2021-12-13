import { classToClass } from "class-transformer";
import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListEventsUseCase } from "./ListEventsUseCase";

class ListEventsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listEventsUseCase = container.resolve(ListEventsUseCase);

    const events = await listEventsUseCase.execute();

    return response.status(201).json(classToClass(events));
  }
}

export { ListEventsController };
