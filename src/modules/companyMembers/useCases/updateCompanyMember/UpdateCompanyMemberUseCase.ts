import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { IfUserExistsAndIsAdmin } from "@utils/validations/ifUserExistsAndIsAdmin";
import { IfUserExists } from "@utils/validations/ifUserExists";
import { ICompanyMembersRepository } from "@modules/companyMembers/repositories/ICompanyMembersRepository";

interface IUpdateCompanyMemberUseCaseProps {
  user_id: string;
  company_id: string;
  users: string[]
}

@injectable()
class UpdateCompanyMemberUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CompanyMembersRepository")
    private companyMembersRepository: ICompanyMembersRepository,
  ) {}

  async execute({ user_id, company_id, users }: IUpdateCompanyMemberUseCaseProps): Promise<void> {
    const adminUser = await this.usersRepository.findById(user_id);

    IfUserExistsAndIsAdmin(adminUser)

    const companyExists = await this.usersRepository.findById(company_id)

    IfUserExists(companyExists)

    if (!companyExists.is_company) {
      throw new AppError('User is not a company')
    }

    for (const user of users) {
      const userExists = await this.usersRepository.findById(user)

      IfUserExists(userExists)

      const userAlreadyIsACompanyMember = await this.companyMembersRepository.findByUserId(user)

      if (userAlreadyIsACompanyMember && userAlreadyIsACompanyMember.company_id !== company_id) {
        throw new AppError(`User [${user}] is already a company member [${userAlreadyIsACompanyMember.company_id}]`)
      }
    }

    const oldCompanyMembers = await this.companyMembersRepository.findByCompanyId(company_id)

    const updateCompanyMembers: string[] = []
    const removedCompanyMembers: string[] = []

    for (const { user_id } of oldCompanyMembers) {
      if (!users.includes(user_id)) {
        removedCompanyMembers.push(user_id);
      }
    }

    for (const user_id of users) {
      if (!oldCompanyMembers.some((user) => user.user_id === user_id)) {
        updateCompanyMembers.push(user_id);
      }
    }

    await Promise.all([
      removedCompanyMembers.map(async member => await this.companyMembersRepository.deleteByUserId(member)),
      updateCompanyMembers.map(async member => await this.companyMembersRepository.create({ company_id, user_id: member }))
    ])

    // const companyMembers = await this.companyMembersRepository.findByCompanyId(company_id)

    // return companyMembers
  }
}

export { UpdateCompanyMemberUseCase };
