import { Request, Response } from "express";
import { container } from "tsyringe";
import { CancelEventUseCase } from "./CancelEventUseCase";

class CancelEventController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { mailMessage } = request.body;
    const { id } = request.params;
    const { id: user_id } = request.user;

    const cancelEventUseCase = container.resolve(CancelEventUseCase);

    const eventCanceled = await cancelEventUseCase.execute(
      id,
      mailMessage,
      user_id
    );

    return response.status(201).json(eventCanceled);
  }
}

export { CancelEventController };
