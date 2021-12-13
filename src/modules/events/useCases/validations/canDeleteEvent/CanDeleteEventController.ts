import { Request, Response } from "express";
import { container } from "tsyringe";
import { CanDeleteEventUseCase } from "./CanDeleteEventUseCase";

class CanDeleteEventController {
  async handle(request: Request, response: Response): Promise<Response> {
    const event_id = String(request.query.event_id);

    const canDeleteEventUseCase = container.resolve(CanDeleteEventUseCase);

    const validation = await canDeleteEventUseCase.execute(event_id);

    return response.status(201).json(validation);
  }
}

export { CanDeleteEventController };
