import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import { ListSchedulesUseCase } from "./ListSchedulesUseCase";

class ListSchedulesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listSchedulesUseCase = container.resolve(ListSchedulesUseCase);

    const schedules = await listSchedulesUseCase.execute();

    return response.status(201).json(classToClass(schedules));
  }
}

export { ListSchedulesController };
