import { container } from "tsyringe";

import { UpdateUsersHoursUseCase } from "./UpdateUsersHoursUseCase";

class UpdateUsersHoursController {
  async handle(): Promise<void> {
    const updateUsersHoursUseCase = container.resolve(UpdateUsersHoursUseCase);

    await updateUsersHoursUseCase.execute();
  }
}

export { UpdateUsersHoursController };
