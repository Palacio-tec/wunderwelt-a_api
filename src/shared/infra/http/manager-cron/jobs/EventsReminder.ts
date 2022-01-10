import { schedule } from "node-cron";

import { SendReminderEventsWillStartController } from "@modules/events/useCases/sendReminderEventsWillStart/SendReminderEventsWillStartController";

function EventsReminder() {
  const sendReminderEventsWillStartController = new SendReminderEventsWillStartController();

  const date = new Date();

  sendReminderEventsWillStartController.handle(date);
}

export default schedule('0 0 * * * *', EventsReminder, { scheduled: false }); // Every minute 00