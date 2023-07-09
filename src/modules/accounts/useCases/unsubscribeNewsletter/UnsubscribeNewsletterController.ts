import { Request, Response } from "express";
import { container } from "tsyringe";
import { UnsubscribeNewsletterUseCase } from "./UnsubscribeNewsletterUseCase";

class UnsubscribeNewsletterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      user_id
    } = request.body;
    const unsubscribeNewsletterUseCase = container.resolve(
      UnsubscribeNewsletterUseCase
    );

    await unsubscribeNewsletterUseCase.execute(user_id);

    return response.status(201).send();
  }
}

export { UnsubscribeNewsletterController };
