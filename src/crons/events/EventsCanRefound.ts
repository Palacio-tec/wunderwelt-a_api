import { SendCanRefoundReminderEventsController } from "@modules/events/useCases/sendCanRefoundReminderEvents/SendCanRefoundReminderEventsController";

async function EventsCanRefound() {
  const sendCanRefoundReminderEventsController = new SendCanRefoundReminderEventsController();

  const date = new Date();

  sendCanRefoundReminderEventsController.handle(date);
}

export { EventsCanRefound }