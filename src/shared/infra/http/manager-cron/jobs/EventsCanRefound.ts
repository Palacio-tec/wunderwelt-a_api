import { schedule } from "node-cron";

import { SendCanRefoundReminderEventsController } from "@modules/events/useCases/sendCanRefoundReminderEvents/SendCanRefoundReminderEventsController";

function EventsCanRefound() {
  const sendCanRefoundReminderEventsController = new SendCanRefoundReminderEventsController();

  const date = new Date();

  sendCanRefoundReminderEventsController.handle(date);
}

export default schedule('0 1 * * * *', EventsCanRefound, { scheduled: false }); // Every minute 01