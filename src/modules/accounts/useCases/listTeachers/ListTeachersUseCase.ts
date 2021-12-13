import { inject, injectable } from "tsyringe";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

@injectable()
class ListTeachersUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(): Promise<User[]> {
    const teachers = await this.usersRepository.listTeachers();

    return teachers;
  }
}

export { ListTeachersUseCase };
