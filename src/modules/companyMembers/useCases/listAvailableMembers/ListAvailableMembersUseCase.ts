import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICompanyMembersRepository } from "@modules/companyMembers/repositories/ICompanyMembersRepository";
import { IfUserExistsAndIsAdmin } from "@utils/validations/ifUserExistsAndIsAdmin";

@injectable()
class ListAvailableMembersUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CompanyMembersRepository")
    private companyMembersRepository: ICompanyMembersRepository,
  ) {}

  async execute(user_id: string): Promise<any[]> {
    const userExists = await this.usersRepository.findById(user_id)

    IfUserExistsAndIsAdmin(userExists)

    const availableMembers = await this.companyMembersRepository.listAvailableMembers()

    return availableMembers;
  }
}

export { ListAvailableMembersUseCase };
