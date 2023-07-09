import { schedule } from "node-cron";

import { SendEventsPreviewEmailController } from "@modules/events/useCases/sendEventsPreviewEmail/SendEventsPreviewEmailController";

function PreviewEventsWillStart() {
  const sendEventsPreviewEmailController = new SendEventsPreviewEmailController();

  const date = new Date();

  sendEventsPreviewEmailController.handle(date);
}

export default schedule(
  process.env.PREVIEW_EVENTS_WILL_START || "0 0 * * * *", // Every minute 00
  PreviewEventsWillStart,
  { scheduled: false }
);