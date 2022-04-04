import { container } from "tsyringe";

import { SendEventsNewsletterUseCase } from "./SendEventsNewsletterUseCase";

class SendEventsNewsletterController {
  async handle(date: Date): Promise<void> {
    const sendEventsNewsletterUseCase = container.resolve(SendEventsNewsletterUseCase);

    await sendEventsNewsletterUseCase.execute(date);
  }
}

export { SendEventsNewsletterController };
