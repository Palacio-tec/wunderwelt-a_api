import { container } from "tsyringe";

import { SendReminderEventsWillStartUseCase } from "./SendReminderEventsWillStartUseCase";

class SendReminderEventsWillStartController {
  async handle(date: Date): Promise<void> {
    const sendReminderEventsWillStartUseCase = container.resolve(SendReminderEventsWillStartUseCase);

    await sendReminderEventsWillStartUseCase.execute(date);
  }
}

export { SendReminderEventsWillStartController };
