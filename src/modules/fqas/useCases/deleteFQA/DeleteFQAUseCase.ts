import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IFQAsRepository } from "@modules/fqas/repositories/IFQAsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class DeleteFQAUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("FQAsRepository")
    private fqasRepository: IFQAsRepository,
  ) {}

  async execute(id: string, user_id: string): Promise<void> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be delete a level");
    }

    await this.fqasRepository.delete(id);
  }
}

export { DeleteFQAUseCase };
