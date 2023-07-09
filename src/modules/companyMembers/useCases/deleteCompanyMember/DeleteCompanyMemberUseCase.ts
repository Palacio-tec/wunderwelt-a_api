import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { IfUserExistsAndIsAdmin } from "@utils/validations/ifUserExistsAndIsAdmin";
import { IfUserExists } from "@utils/validations/ifUserExists";
import { ICompanyMembersRepository } from "@modules/companyMembers/repositories/ICompanyMembersRepository";

interface IDeleteCompanyMemberUseCaseProps {
  user_id: string;
  company_id: string;
}

@injectable()
class DeleteCompanyMemberUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CompanyMembersRepository")
    private companyMembersRepository: ICompanyMembersRepository,
  ) {}

  async execute({ user_id, company_id }: IDeleteCompanyMemberUseCaseProps): Promise<void> {
    const adminUser = await this.usersRepository.findById(user_id);

    IfUserExistsAndIsAdmin(adminUser)

    const companyExists = await this.usersRepository.findById(company_id)

    IfUserExists(companyExists)

    if (!companyExists.is_company) {
      throw new AppError('User is not a company')
    }

    await this.companyMembersRepository.deleteByCompanyId(company_id)
  }
}

export { DeleteCompanyMemberUseCase };
