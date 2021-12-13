import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class ProfileFieldsUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(field: string, value: string, user_id: string): Promise<boolean> {
    if (field !== 'username' && field !== 'email') {
        throw new AppError('Field cannot be found.')
    }

    const users = await this.usersRepository.findByFieldForOtherUser(field, value, user_id);

    const inUse = users.length > 0

    return inUse;
  }
}

export { ProfileFieldsUseCase };
