import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICompanyMembersRepository } from "@modules/companyMembers/repositories/ICompanyMembersRepository";
import { CompanyMember } from "@modules/companyMembers/infra/typeorm/entities/CompanyMember";
import { IfUserExists } from "@utils/validations/ifUserExists";
import { AppError } from "@shared/errors/AppError";

interface FindCompanyMembersByMyIdUseCaseProps {
  company_id: string;
  user_id: string
}


@injectable()
class FindCompanyMembersByMyIdUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CompanyMembersRepository")
    private companyMembersRepository: ICompanyMembersRepository,
  ) {}

  async execute(company_id: string): Promise<{id: string, name: string}[]> {
    const companyExists = await this.usersRepository.findById(company_id)

    IfUserExists(companyExists)

    if (!companyExists.is_company) {
      throw new AppError(`User[${company_id}] is not a company`)
    }

    const companyMembers = await this.companyMembersRepository.listByCompanyId(company_id)

    return companyMembers;
  }
}

export { FindCompanyMembersByMyIdUseCase };
