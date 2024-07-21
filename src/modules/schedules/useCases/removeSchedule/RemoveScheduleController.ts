import { Request, Response } from "express";
import { container } from "tsyringe";
import { RemoveScheduleUseCase } from "./RemoveScheduleUseCase";

class RemoveScheduleController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { eventId, userId,mailDescription } = request.body;
    const adminId = request.user.id;

    const removeScheduleUseCase = container.resolve(RemoveScheduleUseCase);

    await removeScheduleUseCase.execute(eventId, userId, adminId, mailDescription);

    return response.status(200).send();
  }
}

export { RemoveScheduleController };
