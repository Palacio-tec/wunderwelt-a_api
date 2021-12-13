import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateHoursUseCase } from "./CreateHoursUseCase";

class CreateHoursController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { amount } = request.body;
    const expiration_date = new Date();
    const user_id = request.user.id;

    const createHoursUseCase = container.resolve(CreateHoursUseCase);

    const hours = await createHoursUseCase.execute({
      amount,
      expiration_date,
      user_id,
    });

    return response.status(201).json(hours);
  }
}

export { CreateHoursController };
