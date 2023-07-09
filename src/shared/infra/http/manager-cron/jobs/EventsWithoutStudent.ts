import { schedule } from "node-cron";

import { CancelEventWithoutStudentController } from "@modules/events/useCases/cancelEventWithoutStudent/CancelEventWithoutStudentController";

function EventsWithoutStudent() {
  const cancelEventWithoutStudentController = new CancelEventWithoutStudentController();

  const date = new Date();

  cancelEventWithoutStudentController.handle(date);
}

export default schedule(
  process.env.EVENTS_WITHOUT_STUDENT || "0 0 * * * *", // Every minute 00
  EventsWithoutStudent,
  { scheduled: false }
);