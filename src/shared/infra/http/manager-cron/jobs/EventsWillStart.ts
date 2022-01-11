import { schedule } from "node-cron";

import { SendEventsWillStartEmailController } from "@modules/events/useCases/sendEventsWillStartEmail/SendEventsWillStartEmailController";

function EventsWillStart() {
  const sendEventsWillStartEmailController = new SendEventsWillStartEmailController();

  const date = new Date();

  sendEventsWillStartEmailController.handle(date);
}

export default schedule('0 0 * * * *', EventsWillStart, { scheduled: false }); // Every minute 00