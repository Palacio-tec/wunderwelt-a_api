import { Request, Response } from "express";
import { container } from "tsyringe";
import { UnsubscribeAllUseCase } from "./UnsubscribeAllUseCase";

class UnsubscribeAllController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      user_id
    } = request.body;
    const unsubscribeAllUseCase = container.resolve(
      UnsubscribeAllUseCase
    );

    await unsubscribeAllUseCase.execute(user_id);

    return response.status(201).send();
  }
}

export { UnsubscribeAllController };
