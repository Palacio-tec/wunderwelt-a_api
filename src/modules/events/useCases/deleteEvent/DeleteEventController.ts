import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteEventUseCase } from "./DeleteEventUseCase";

class DeleteEventController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { mailMessage } = request.body;
    const { id } = request.params;
    const { id: user_id } = request.user;
    const deleteEventUseCase = container.resolve(DeleteEventUseCase);

    await deleteEventUseCase.execute(id, user_id, mailMessage);

    return response.status(201).send();
  }
}

export { DeleteEventController };
