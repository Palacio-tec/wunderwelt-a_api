import { CancelEventWithoutStudentController } from "@modules/events/useCases/cancelEventWithoutStudent/CancelEventWithoutStudentController";

async function EventsWithoutStudent() {
  const cancelEventWithoutStudentController = new CancelEventWithoutStudentController();

  const date = new Date();

  cancelEventWithoutStudentController.handle(date);
}

export { EventsWithoutStudent }