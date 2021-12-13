import { inject, injectable } from "tsyringe";

import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class LevelFieldsUseCase {
  constructor(
    @inject("LevelsRepository")
    private levelsRepository: ILevelsRepository
  ) {}

  async execute(field: string, value: string, level_id?: string): Promise<boolean> {
    if (field !== 'name') {
      throw new AppError('Field cannot be found.')
    }

    if (field === 'name') {
      value = value.toUpperCase()
    }

    let levels = []

    if (level_id !== undefined) {
      levels = await this.levelsRepository.findByFieldForOtherLevel(field, value, String(level_id));
    } else {
      levels = await this.levelsRepository.findByField(field, value);
    }

    const inUse = levels.length > 0

    return inUse;
  }
}

export { LevelFieldsUseCase };
