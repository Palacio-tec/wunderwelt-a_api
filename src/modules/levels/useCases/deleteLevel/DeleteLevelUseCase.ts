import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class DeleteLevelUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("EventsLevelsRepository")
    private eventsLevelsRepository: IEventsLevelsRepository,

    @inject("LevelsRepository")
    private levelsRepository: ILevelsRepository,
  ) {}

  async execute(id: string, user_id: string): Promise<void> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be delete a level");
    }

    const levelInUse = await this.eventsLevelsRepository.findByLevel(id);

    if (levelInUse.length > 0) {
      throw new AppError("Level is being used in an Event");
    }

    await this.levelsRepository.delete(id);
  }
}

export { DeleteLevelUseCase };
