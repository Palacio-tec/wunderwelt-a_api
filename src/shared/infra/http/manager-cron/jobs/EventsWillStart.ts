import { schedule } from "node-cron";

import { SendEventsWillStartEmailController } from "@modules/events/useCases/sendEventsWillStartEmail/SendEventsWillStartEmailController";

function EventsWillStart() {
  const sendEventsWillStartEmailController = new SendEventsWillStartEmailController();

  const date = new Date();

  sendEventsWillStartEmailController.handle(date);
}

export default schedule(
  process.env.EVENTS_WILL_START || "0 0 * * * *", // Every minute 00
  EventsWillStart,
  { scheduled: false }
);