import { schedule } from "node-cron";

import { SendCanRefoundReminderEventsController } from "@modules/events/useCases/sendCanRefoundReminderEvents/SendCanRefoundReminderEventsController";

function EventsCanRefound() {
  const sendCanRefoundReminderEventsController = new SendCanRefoundReminderEventsController();

  const date = new Date();

  sendCanRefoundReminderEventsController.handle(date);
}

export default schedule(
  process.env.EVENTS_CAN_REFOUND || "0 1 * * * *", // Every minute 01
  EventsCanRefound,
  { scheduled: false }
);