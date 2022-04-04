import { schedule } from "node-cron";

import { CancelEventWithoutStudentController } from "@modules/events/useCases/cancelEventWithoutStudent/CancelEventWithoutStudentController";

function EventsWithoutStudent() {
  const cancelEventWithoutStudentController = new CancelEventWithoutStudentController();

  const date = new Date();

  cancelEventWithoutStudentController.handle(date);
}

export default schedule('0 0 * * * *', EventsWithoutStudent, { scheduled: false }); // Every minute 00