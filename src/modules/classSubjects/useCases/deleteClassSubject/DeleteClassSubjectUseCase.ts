import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { IClassSubjectsRepository } from "@modules/classSubjects/repositories/IClassSubjectsRepository";

@injectable()
class DeleteClassSubjectUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("ClassSubjectsRepository")
    private classSubjectsRepository: IClassSubjectsRepository,
  ) {}

  async execute(id: string, user_id: string): Promise<void> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be delete a class subject");
    }

    await this.classSubjectsRepository.delete(id);
  }
}

export { DeleteClassSubjectUseCase };
