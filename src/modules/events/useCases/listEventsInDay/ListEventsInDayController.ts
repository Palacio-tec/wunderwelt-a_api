import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import { ListEventsInDayUseCase } from "./ListEventsInDayUseCase";

class ListEventsInDayController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { year, month, day } = request.query;
    const listEventsInDayUseCase = container.resolve(ListEventsInDayUseCase);

    const events = await listEventsInDayUseCase.execute({ year, month, day });

    return response.status(201).json(classToClass(events));
  }
}

export { ListEventsInDayController };
