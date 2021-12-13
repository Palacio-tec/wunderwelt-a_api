import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import { ListQueuesUseCase } from "./ListQueuesUseCase";

class ListQueuesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listQueuesUseCase = container.resolve(ListQueuesUseCase);

    const queues = await listQueuesUseCase.execute();

    return response.status(201).json(classToClass(queues));
  }
}

export { ListQueuesController };
