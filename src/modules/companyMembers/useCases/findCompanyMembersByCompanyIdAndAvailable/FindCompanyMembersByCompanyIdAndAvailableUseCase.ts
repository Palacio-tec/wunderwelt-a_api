import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICompanyMembersRepository } from "@modules/companyMembers/repositories/ICompanyMembersRepository";
import { IfUserExists } from "@utils/validations/ifUserExists";
import { AppError } from "@shared/errors/AppError";
import { IfUserExistsAndIsAdmin } from "@utils/validations/ifUserExistsAndIsAdmin";

interface FindCompanyMembersByCompanyIdAndAvailableUseCaseProps {
  company_id: string;
  user_id: string
}

@injectable()
class FindCompanyMembersByCompanyIdAndAvailableUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CompanyMembersRepository")
    private companyMembersRepository: ICompanyMembersRepository,
  ) {}

  async execute({ company_id, user_id }:FindCompanyMembersByCompanyIdAndAvailableUseCaseProps ): Promise<{
    id: string;
    name: string;
    email: string;
    created_at: Date;
    is_member: boolean;
  }[]> {
    const companyExists = await this.usersRepository.findById(company_id)

    IfUserExists(companyExists)

    if (!companyExists.is_company) {
      throw new AppError(`User[${company_id}] is not a company`)
    }

    const userExists = await this.usersRepository.findById(user_id)

    IfUserExistsAndIsAdmin(userExists)

    const companyMembers = await this.companyMembersRepository.findByCompanyIdAndAvailable(company_id)

    return companyMembers;
  }
}

export { FindCompanyMembersByCompanyIdAndAvailableUseCase };
