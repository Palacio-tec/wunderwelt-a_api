import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { IfUserExists } from "@utils/validations/ifUserExists";
import { ICompanyMembersRepository } from "@modules/companyMembers/repositories/ICompanyMembersRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";

interface IResponse {
  id: string;
  name: string;
  title: string;
  start_date: string;
}

interface ListMembersHistoricUseCaseProps {
  user_id: string;
  member_id: string;
}

@injectable()
class ListMembersHistoricUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CompanyMembersRepository")
    private companyMembersRepository: ICompanyMembersRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,
  ) {}

  async execute({
    user_id,
    member_id
  }: ListMembersHistoricUseCaseProps): Promise<IResponse[][]> {
    const historics: IResponse[][] = []
    const userExists = await this.usersRepository.findById(user_id);

    IfUserExists(userExists)

    if (!userExists.is_company) {
      throw new AppError(`User [${user_id}] is not a company.`)
    }

    if (member_id) {
      const memberExists = await this.usersRepository.findById(member_id);

      IfUserExists(memberExists)

      const isAMember = await this.companyMembersRepository.findByUserId(member_id)

      if (!isAMember) {
        throw new AppError(`User [${member_id}] is not a member.`)
      }

      const historic = await this.schedulesRepository.listUserHistoric(member_id)

      historics.push(historic)
    } else {
      const companyMembers = await this.companyMembersRepository.findByCompanyId(user_id)

      for (const companyMember of companyMembers) {
        const historic = await this.schedulesRepository.listUserHistoric(companyMember.user_id)

        historics.push(historic)
      }
    }
    return historics;
  }
}

export { ListMembersHistoricUseCase };
