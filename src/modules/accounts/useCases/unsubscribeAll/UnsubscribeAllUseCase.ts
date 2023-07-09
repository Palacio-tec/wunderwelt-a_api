import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IfUserExists } from "@utils/validations/ifUserExists";

@injectable()
class UnsubscribeAllUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute(user_id: string): Promise<void> {
    const userExists = await this.usersRepository.findById(user_id)

    IfUserExists(userExists)

    userExists.receive_newsletter = false
    userExists.receive_email = false

    await this.usersRepository.create(userExists);
  }
}

export { UnsubscribeAllUseCase };
