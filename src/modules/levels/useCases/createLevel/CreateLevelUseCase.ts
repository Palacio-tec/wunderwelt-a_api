import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateLevelsDTO } from "@modules/levels/dtos/ICreateLevelsDTO";
import { Level } from "@modules/levels/infra/typeorm/entities/Level";
import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateLevelUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("LevelsRepository")
    private levelsRepository: ILevelsRepository
  ) {}

  async execute({
    name,
    color,
    variant,
  }: ICreateLevelsDTO, user_id: string): Promise<Level> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be create an event");
    }

    const levelExists = await this.levelsRepository.findByName(name);

    if (levelExists) {
      throw new AppError("Level name already exist");
    }

    const level = this.levelsRepository.create({
      name,
      color,
      variant,
    });

    return level;
  }
}

export { CreateLevelUseCase };
