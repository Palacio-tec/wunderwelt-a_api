import { Request, Response } from "express";
import { container } from "tsyringe";

import { SendEventsWillStartEmailUseCase } from "../sendEventsWillStartEmail/SendEventsWillStartEmailUseCase";

class SendEmailEventsWillStartController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { date } = request.body;

    const sendEventsWillStartEmail = container.resolve(SendEventsWillStartEmailUseCase);

    sendEventsWillStartEmail.execute(date);

    return response.status(201).send();
  }
}

export { SendEmailEventsWillStartController };
