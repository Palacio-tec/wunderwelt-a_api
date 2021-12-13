import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateQueueUseCase } from "./CreateQueueUseCase";

class CreateQueueController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: event_id } = request.params;
    const { sugestion } = request.body;
    const user_id = request.user.id;

    const createQueueUseCase = container.resolve(CreateQueueUseCase);

    const queue = await createQueueUseCase.execute({
      event_id,
      user_id,
      sugestion,
    });

    return response.status(201).json(queue);
  }
}

export { CreateQueueController };
