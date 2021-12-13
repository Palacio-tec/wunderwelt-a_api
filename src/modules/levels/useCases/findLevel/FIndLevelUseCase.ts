import { inject, injectable } from "tsyringe";

import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";

type Level = {
  name: string;
  color: string;
  variant: string;
};

@injectable()
class FindLevelUseCase {
  constructor(
    @inject("LevelsRepository")
    private levelsRepository: ILevelsRepository,
  ) {}

  async execute(id: string): Promise<Level> {
    const {
      name,
      color,
      variant,
    } = await this.levelsRepository.findById(id);

    return {
      name,
      color,
      variant,
    };
  }
}

export { FindLevelUseCase };
