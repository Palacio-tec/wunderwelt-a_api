import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListUserEventsRegisteredUseCase } from "./ListUserEventsRegisteredUseCase";

class ListUserEventsRegisteredController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { willStart } = request.query;
    const { id: user_id } = request.user;

    const willStartFormated = String(willStart).toLowerCase() === 'true'

    const listUserEventsRegisteredUseCase = container.resolve(
        ListUserEventsRegisteredUseCase
    );

    const events = await listUserEventsRegisteredUseCase.execute({
      user_id,
      willStart: willStartFormated
    });

    return response.status(201).json(events);
  }
}

export { ListUserEventsRegisteredController };
