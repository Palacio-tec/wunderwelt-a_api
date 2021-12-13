import { container } from "tsyringe";

import { SendCanRefoundReminderEventsUseCase } from "./SendCanRefoundReminderEventsUseCase";

class SendCanRefoundReminderEventsController {
  async handle(date: Date): Promise<void> {
    const sendCanRefoundReminderEventsUseCase = container.resolve(SendCanRefoundReminderEventsUseCase);

    await sendCanRefoundReminderEventsUseCase.execute(date);
  }
}

export { SendCanRefoundReminderEventsController };
