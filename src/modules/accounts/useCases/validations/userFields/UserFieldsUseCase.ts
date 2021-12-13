import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class UserFieldsUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(field: string, value: string, user_id?: string): Promise<boolean> {
    if (field !== 'username' && field !== 'email') {
      throw new AppError('Field cannot be found.')
    }

    let users = []

    if (user_id !== undefined) {
      users = await this.usersRepository.findByFieldForOtherUser(field, value, String(user_id));
    } else {
      users = await this.usersRepository.findByField(field, value);
    }

    const inUse = users.length > 0

    return inUse;
  }
}

export { UserFieldsUseCase };
