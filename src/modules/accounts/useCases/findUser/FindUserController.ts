import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindUserUseCase } from "./FIndUserUseCase";

class FindUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const findUserUseCase = container.resolve(FindUserUseCase);

    const user = await findUserUseCase.execute(id);

    return response.status(201).json(user);
  }
}

export { FindUserController };
