import { container } from "tsyringe";

import { SendEventsPreviewEmailUseCase } from "./SendEventsPreviewEmailUseCase";

class SendEventsPreviewEmailController {
  async handle(date: Date): Promise<void> {
    const sendEventsPreviewEmail = container.resolve(SendEventsPreviewEmailUseCase);

    await sendEventsPreviewEmail.execute(date);
  }
}

export { SendEventsPreviewEmailController };
