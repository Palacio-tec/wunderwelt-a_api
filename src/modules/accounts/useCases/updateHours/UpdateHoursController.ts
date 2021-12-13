import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateHoursUseCase } from "./UpdateHoursUseCase";

class UpdateHoursController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { amount } = request.body;

    const user_id = request.user.id;

    const updateHoursUseCase = container.resolve(UpdateHoursUseCase);

    const hours = await updateHoursUseCase.execute({
      amount,
      user_id,
    });

    return response.status(201).json(hours);
  }
}

export { UpdateHoursController };
