import { inject, injectable } from "tsyringe";

import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { Hours } from "@modules/accounts/infra/typeorm/entities/Hours";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class ListAvailableHoursForUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,
  ) {}

  async execute(user_id: string): Promise<Hours[]> {
    const userExists = await this.usersRepository.findById(user_id)

    if (!userExists) {
        throw new AppError("User does not exists");
    }

    const hours = await this.hoursRepository.listAvailableByUser(user_id);

    return hours;
  }
}

export { ListAvailableHoursForUserUseCase };
