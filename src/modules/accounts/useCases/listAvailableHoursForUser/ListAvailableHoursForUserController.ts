import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAvailableHoursForUserUseCase } from "./ListAvailableHoursForUseCase";

class ListAvailableHoursForUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = String(request.params.userId);
    const listAvailableHoursForUserUseCase = container.resolve(ListAvailableHoursForUserUseCase);

    const user = await listAvailableHoursForUserUseCase.execute(userId);

    return response.status(201).json(user);
  }
}

export { ListAvailableHoursForUserController };
