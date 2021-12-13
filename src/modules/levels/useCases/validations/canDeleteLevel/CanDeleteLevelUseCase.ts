import { inject, injectable } from "tsyringe";

import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";

type IReturn = {
  ok: boolean;
  message: string;
}

@injectable()
class CanDeleteLevelUseCase {
  constructor(
    @inject("LevelsRepository")
    private levelsRepository: ILevelsRepository,

    @inject("EventsLevelsRepository")
    private eventsLevelsRepository: IEventsLevelsRepository,
  ) {}

  async execute(level_id: string): Promise<IReturn> {
    const messageReturn = {
      ok: true,
      message: '',
    }
    const level = await this.levelsRepository.findById(level_id);

    if (!level) {
      messageReturn.ok = false;
      messageReturn.message = 'Nível não existe'

      return messageReturn
    }

    const eventLevels = await this.eventsLevelsRepository.findByLevel(level_id);

    if (eventLevels.length > 0) {
      messageReturn.ok = false;
      messageReturn.message = 'Nível está vinculado a alguma aula'

      return messageReturn
    }

    return messageReturn
  }
}

export { CanDeleteLevelUseCase };
