import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICompanyMembersRepository } from "@modules/companyMembers/repositories/ICompanyMembersRepository";
import { CompanyMember } from "@modules/companyMembers/infra/typeorm/entities/CompanyMember";
import { IfUserExists } from "@utils/validations/ifUserExists";
import { AppError } from "@shared/errors/AppError";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";

interface IListCompanyMembersHistoricUseCaseProps {
  company_id: string;
  users: string[];
}

@injectable()
class ListCompanyMembersHistoricUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CompanyMembersRepository")
    private companyMembersRepository: ICompanyMembersRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,
  ) {}

  async execute({ company_id, users }: IListCompanyMembersHistoricUseCaseProps): Promise<CompanyMember[]> {
    const companyMembersHistoric = []
    const companyExists = await this.usersRepository.findById(company_id)

    IfUserExists(companyExists)

    if (!companyExists.is_company) {
      throw new AppError('User is not a company')
    }

    for (const user in users) {
      const userExists = await this.usersRepository.findById(user)

      IfUserExists(userExists)

      const companyMemberExists = await this.companyMembersRepository.findByUserId(user)

      if (!companyMemberExists) {
        throw new AppError(`User [${user}] does not belong to a company`)
      } else if (companyMemberExists.company_id !== company_id) {
        throw new AppError(`User [${user}] does not belong to this company`)
      }
    }

    for (const user of users) {
      const schedules = await this.schedulesRepository.findByUserId(user)

      companyMembersHistoric.push(schedules)
    }

    return companyMembersHistoric;
  }
}

export { ListCompanyMembersHistoricUseCase };
