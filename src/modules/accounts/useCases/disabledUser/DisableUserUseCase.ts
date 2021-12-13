import { inject, injectable } from "tsyringe";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class DisableUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("User does not exists");
    }
    
    if (user.inactivation_date) {
      user.inactivation_date = null;
    } else {
      user.inactivation_date = new Date();
    }

    await this.usersRepository.create(user);

    return user;
  }
}

export { DisableUserUseCase };
