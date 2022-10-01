import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAvailableHoursUseCase } from "./ListAvailableHoursUseCase";

class ListAvailableHoursController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const listAvailableHoursUseCase = container.resolve(ListAvailableHoursUseCase);

    const user = await listAvailableHoursUseCase.execute(id);

    return response.status(201).json(user);
  }
}

export { ListAvailableHoursController };
