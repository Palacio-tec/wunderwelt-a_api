import { Request, Response } from "express";
import { container } from "tsyringe";
import { DisableUserUseCase } from "./DisableUserUseCase";

class DisableUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const disableUserUseCase = container.resolve(DisableUserUseCase);

    const user = await disableUserUseCase.execute(id);

    return response.status(201).json(user);
  }
}

export { DisableUserController };
