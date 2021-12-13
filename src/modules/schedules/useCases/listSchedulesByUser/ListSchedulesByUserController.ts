import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListSchedulesByUserUserCase } from "./ListSchedulesByUserUseCase";

class ListSchedulesByUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listSchedulesByUserUserCase = container.resolve(
      ListSchedulesByUserUserCase
    );

    const { id } = request.user;

    const schedules = await listSchedulesByUserUserCase.execute(id);

    return response.status(201).json(schedules);
  }
}

export { ListSchedulesByUserController };
