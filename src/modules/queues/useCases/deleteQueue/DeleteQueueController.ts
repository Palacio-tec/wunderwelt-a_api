import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteQueueUseCase } from "./DeleteQueueUseCase";

class DeleteQueueController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const user_id = request.user.id;

    const deleteQueueUsecase = container.resolve(DeleteQueueUseCase);

    await deleteQueueUsecase.execute(id, user_id);

    return response.status(201).send();
  }
}

export { DeleteQueueController };
