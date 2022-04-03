import { schedule } from "node-cron";

import { SendEventsNewsletterController } from "@modules/events/useCases/sendEventsNewsletter/SendEventsNewsletterController";


function EventsNewsletter() {
  const sendEventsNewsletterController = new SendEventsNewsletterController();

  const date = new Date();

  sendEventsNewsletterController.handle(date);
}

export default schedule('0 0 10 * * *', EventsNewsletter, { scheduled: false }); // Every hour 10