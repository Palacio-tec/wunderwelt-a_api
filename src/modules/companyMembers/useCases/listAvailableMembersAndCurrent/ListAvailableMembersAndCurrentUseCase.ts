import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICompanyMembersRepository } from "@modules/companyMembers/repositories/ICompanyMembersRepository";
import { IfUserExistsAndIsAdmin } from "@utils/validations/ifUserExistsAndIsAdmin";
import { IfUserExists } from "@utils/validations/ifUserExists";
import { AppError } from "@shared/errors/AppError";

interface ListAvailableMembersAndCurrentUseCaseProps {
  company_id: string;
  user_id: string;
}

@injectable()
class ListAvailableMembersAndCurrentUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CompanyMembersRepository")
    private companyMembersRepository: ICompanyMembersRepository,
  ) {}

  async execute({ company_id, user_id }: ListAvailableMembersAndCurrentUseCaseProps): Promise<any[]> {
    const userExists = await this.usersRepository.findById(user_id)

    IfUserExistsAndIsAdmin(userExists)

    const companyExists = await this.usersRepository.findById(company_id)

    IfUserExists(companyExists)

    if (!companyExists.is_company) {
      throw new AppError('User is not a company')
    }

    const availableAndCurrentMembers = await this.companyMembersRepository.listAvailableCompaniesAndCurrent(company_id)

    return availableAndCurrentMembers;
  }
}

export { ListAvailableMembersAndCurrentUseCase };
