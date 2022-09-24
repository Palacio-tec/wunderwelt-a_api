import { schedule } from "node-cron";

import { SendEventsPreviewEmailController } from "@modules/events/useCases/sendEventsPreviewEmail/SendEventsPreviewEmailController";

function PreviewEventsWillStart() {
  const sendEventsPreviewEmailController = new SendEventsPreviewEmailController();

  const date = new Date();

  sendEventsPreviewEmailController.handle(date);
}

export default schedule('0 0 * * * *', PreviewEventsWillStart, { scheduled: false }); // Every minute 00