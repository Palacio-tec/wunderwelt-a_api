import { inject, injectable } from "tsyringe";

import { Level } from "@modules/levels/infra/typeorm/entities/Level";
import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";

@injectable()
class ListLevelsUseCase {
  constructor(
    @inject("LevelsRepository")
    private levelsRepository: ILevelsRepository
  ) {}

  async execute(): Promise<Level[]> {
    const levels = await this.levelsRepository.list();

    return levels;
  }
}

export { ListLevelsUseCase };
