import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import { FindByEventIdUseCase } from "./FindByEventIdUseCase";

class FindByEventIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const findByEventIdUseCase = container.resolve(
        FindByEventIdUseCase
    );

    const { eventId } = request.params;

    const schedules = await findByEventIdUseCase.execute(eventId);

    return response.status(201).json(classToClass(schedules));
  }
}

export { FindByEventIdController };
