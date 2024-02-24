import { Request, Response } from "express";
import { container } from "tsyringe";

import { CanScheduleUseCase } from "./CanScheduleUseCase";

class CanScheduleController {
  async handle(request: Request, response: Response): Promise<Response> {
    const canScheduleUseCase = container.resolve(
        CanScheduleUseCase
    );
    const classSubjectId = request.query.classSubjectId as string;
    const event_date = request.query.eventDate as string;
    const { id: user_id } = request.user;

    const canSchedule = await canScheduleUseCase.execute(classSubjectId, user_id, event_date);

    return response.status(201).json(canSchedule);
  }
}

export { CanScheduleController };
