import { SendReminderEventsWillStartController } from "@modules/events/useCases/sendReminderEventsWillStart/SendReminderEventsWillStartController";

async function EventsReminder() {
  const sendReminderEventsWillStartController = new SendReminderEventsWillStartController();

  const date = new Date();

  sendReminderEventsWillStartController.handle(date);
}

export { EventsReminder }