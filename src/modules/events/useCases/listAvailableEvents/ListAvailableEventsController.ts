import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAvailableEventsUseCase } from "./ListAvailableEventsUseCase";

class ListAvailableEventsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query;
    const { id: user_id } = request.user;

    const listAvailableEventsUseCase = container.resolve(
      ListAvailableEventsUseCase
    );

    const events = await listAvailableEventsUseCase.execute({
      user_id,
      filter: filter ? String(filter).toLowerCase() : ''
    });

    return response.status(201).json(events);
  }
}

export { ListAvailableEventsController };
