import { Request, Response } from "express";
import { container } from "tsyringe";

import { UnsubscribeUserUseCase } from "./UnsubscribeUserUseCase";

class UnsubscribeUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const unsubscribeUserUseCase = container.resolve(UnsubscribeUserUseCase);

    await unsubscribeUserUseCase.execute(user_id);

    return response.status(201).send();
  }
}

export { UnsubscribeUserController };
