import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListEventsInMonthUseCase } from "./ListEventsInMonthUseCase";

class ListEventsInMonthController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { year, month } = request.query;
    const listEventsInMonthUseCase = container.resolve(ListEventsInMonthUseCase);

    const events = await listEventsInMonthUseCase.execute({
      year,
      month,
    });

    return response.status(201).json(events);
  }
}

export { ListEventsInMonthController };
