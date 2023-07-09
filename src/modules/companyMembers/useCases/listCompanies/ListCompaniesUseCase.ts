import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICompanyMembersRepository } from "@modules/companyMembers/repositories/ICompanyMembersRepository";
import { IfUserExistsAndIsAdmin } from "@utils/validations/ifUserExistsAndIsAdmin";

@injectable()
class ListCompaniesUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CompanyMembersRepository")
    private companyMembersRepository: ICompanyMembersRepository
  ) {}

  async execute(user_id: string): Promise<{id: string, name: string}[]> {
    const userExists = await this.usersRepository.findById(user_id)

    IfUserExistsAndIsAdmin(userExists)

    const companies = await this.companyMembersRepository.listCompanies()

    return companies;
  }
}

export { ListCompaniesUseCase };
