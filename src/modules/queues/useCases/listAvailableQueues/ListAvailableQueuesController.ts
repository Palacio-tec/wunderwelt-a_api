import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import { ListAvailableQueuesUseCase } from "./ListAvailableQueuesUseCase";

class ListAvailableQueuesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const listAvailableQueuesUseCase = container.resolve(ListAvailableQueuesUseCase);

    const queues = await listAvailableQueuesUseCase.execute({
      user_id
    });

    return response.status(201).json(classToClass(queues));
  }
}

export { ListAvailableQueuesController };
