import { schedule } from "node-cron";

import { SendReminderEventsWillStartController } from "@modules/events/useCases/sendReminderEventsWillStart/SendReminderEventsWillStartController";

function EventsReminder() {
  const sendReminderEventsWillStartController = new SendReminderEventsWillStartController();

  const date = new Date();

  sendReminderEventsWillStartController.handle(date);
}

export default schedule(
  process.env.EVENTS_REMINDER || "0 0 * * * *", // Every minute 00
  EventsReminder,
  { scheduled: false }
);