import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListEventsMonthlyUseCase } from "./ListEventsMonthlyUseCase";

class ListEventsMonthlyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { year, month } = request.query;
    const listEventsMonthlyUseCase = container.resolve(ListEventsMonthlyUseCase);

    const events = await listEventsMonthlyUseCase.execute({
      year,
      month,
    });

    return response.status(201).json(events);
  }
}

export { ListEventsMonthlyController };
