import { Request, Response } from "express";
import { container } from "tsyringe";

import { SendTestEmailUseCase } from "./SendTestEmailUseCase";

class SendTestEmailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId, eventDate } = request.body;

    const sendTestEmailUseCase = container.resolve(SendTestEmailUseCase);

    sendTestEmailUseCase.execute({userId, eventDate});

    return response.status(201).send();
  }
}

export { SendTestEmailController };
