import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateScheduleUseCase } from "./CreateScheduleUseCase";

class CreateScheduleController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      event_id,
      subject,
    } = request.body;
    const { id } = request.user;

    const createScheduleUseCase = container.resolve(CreateScheduleUseCase);

    const schedule = await createScheduleUseCase.execute({
      event_id,
      user_id: id,
      subject,
    });

    return response.status(201).json(schedule);
  }
}

export { CreateScheduleController };
