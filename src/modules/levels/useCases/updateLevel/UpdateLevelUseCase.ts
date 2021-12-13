import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateLevelsDTO } from "@modules/levels/dtos/ICreateLevelsDTO";
import { Level } from "@modules/levels/infra/typeorm/entities/Level";
import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class UpdateLevelUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("LevelsRepository")
    private levelsRepository: ILevelsRepository
  ) {}

  async execute({
      id,
      name,
      color,
      variant,
    }: ICreateLevelsDTO,
    user_id: string
  ): Promise<Level> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be update an event");
    }

    const levelIdExists = await this.levelsRepository.findById(id);

    if (!levelIdExists) {
      throw new AppError("Level does not exists");
    }

    const levelNameExists = await this.levelsRepository.findByName(name);

    if (levelNameExists && levelNameExists.id !== id) {
      throw new AppError("Level name already exists");
    }

    const level = this.levelsRepository.create({
      id,
      name,
      color,
      variant,
    });

    return level;
  }
}

export { UpdateLevelUseCase };
