import { container } from "tsyringe";

import { CancelEventWithoutStudentUseCase } from "./CancelEventWithoutStudentUseCase";

class CancelEventWithoutStudentController {
  async handle(date: Date): Promise<void> {
    const cancelEventWithoutStudent = container.resolve(CancelEventWithoutStudentUseCase);

    await cancelEventWithoutStudent.execute(date);
  }
}

export { CancelEventWithoutStudentController };
