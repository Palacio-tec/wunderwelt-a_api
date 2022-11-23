import { SendEventsNewsletterUseCase } from "@modules/events/useCases/sendEventsNewsletter/SendEventsNewsletterUseCase";
import { Request, Response } from "express";
import { container } from "tsyringe";

class SendMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { template, to, message } = request.body;

    const sendEventsNewsletterUseCase = container.resolve(SendEventsNewsletterUseCase);

    await sendEventsNewsletterUseCase.execute(
        new Date(),
        true,
        {
            to,
            message
        }
    );

    return response.status(201).send();
  }
}

export { SendMailController };
