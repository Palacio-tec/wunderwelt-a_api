import { Request, Response } from "express";
import { container } from "tsyringe";

import { CanScheduleUseCase } from "./CanScheduleUseCase";

class CanScheduleController {
  async handle(request: Request, response: Response): Promise<Response> {
    const canScheduleUseCase = container.resolve(
        CanScheduleUseCase
    );
    const event_id = request.query.eventId as string
    const { id: user_id } = request.user;

    const canSchedule = await canScheduleUseCase.execute(event_id, user_id);

    return response.status(201).json(canSchedule);
  }
}

export { CanScheduleController };
