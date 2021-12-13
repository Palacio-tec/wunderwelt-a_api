import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteScheduleUseCase } from "./DeleteScheduleUseCase";

class DeleteScheduleController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { eventId } = request.params;
    const user_id = request.user.id;

    const deleteScheduleUseCase = container.resolve(DeleteScheduleUseCase);

    await deleteScheduleUseCase.execute(eventId, user_id);

    return response.status(201).send();
  }
}

export { DeleteScheduleController };
