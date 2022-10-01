import { container } from "tsyringe";

import { ListWillExpiredHoursUseCase } from "./ListWillExpiredHoursUseCase";

class ListWillExpiredHoursController {
  async handle(date: Date, addDays: number): Promise<void> {
    const listWillExpiredHoursUseCase = container.resolve(ListWillExpiredHoursUseCase);

    await listWillExpiredHoursUseCase.execute(date, addDays);
  }
}

export { ListWillExpiredHoursController };
