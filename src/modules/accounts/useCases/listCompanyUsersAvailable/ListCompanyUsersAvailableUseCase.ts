import { inject, injectable } from "tsyringe";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

@injectable()
class ListCompanyUsersAvailableUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(): Promise<{id: string, name: string}[]> {
    const users = await this.usersRepository.listCompanyUsersWithoutMembers();

    return users;
  }
}

export { ListCompanyUsersAvailableUseCase };
