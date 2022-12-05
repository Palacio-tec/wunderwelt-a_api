import { Request, Response } from "express";
import { container } from "tsyringe";

import { SendSupportMailUseCase } from "./SendSupportMailUseCase";

class SendSupportMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      subject,
      description,
      user,
    } = request.body;

    const sendSupportMailUseCase = container.resolve(SendSupportMailUseCase);

    await sendSupportMailUseCase.execute({
        subject,
        description,
        user,
    });

    return response.status(201).send();
  }
}

export { SendSupportMailController };
