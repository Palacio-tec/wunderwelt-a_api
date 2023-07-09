import { schedule } from "node-cron";

import { SendEventsNewsletterController } from "@modules/events/useCases/sendEventsNewsletter/SendEventsNewsletterController";


function EventsNewsletter() {
  const sendEventsNewsletterController = new SendEventsNewsletterController();

  const date = new Date();

  sendEventsNewsletterController.handle(date);
}

export default schedule(
  process.env.EVENTS_NEWSLETTER || "0 0 10 * * *", // Every 10 o'clock
  EventsNewsletter,
  { scheduled: false }
);
