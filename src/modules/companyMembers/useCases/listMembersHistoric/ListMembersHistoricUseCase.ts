import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICompanyMembersRepository, listMembersReportByCompanyNameOrUserResponse } from "@modules/companyMembers/repositories/ICompanyMembersRepository";
import { IfUserExistsAndIsAdmin } from "@utils/validations/ifUserExistsAndIsAdmin";

interface IResponse {
  id: string;
  name: string;
  title: string;
  start_date: string;
}

interface ListMembersHistoricUseCaseProps {
  name: string;
  userId: string;
}

@injectable()
class ListMembersHistoricUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CompanyMembersRepository")
    private companyMembersRepository: ICompanyMembersRepository,
  ) {}

  async execute({ name, userId }: ListMembersHistoricUseCaseProps): Promise<listMembersReportByCompanyNameOrUserResponse[]> {
    const userExists = await this.usersRepository.findById(userId);

    IfUserExistsAndIsAdmin(userExists)

    const report = await this.companyMembersRepository.listMembersReportByCompanyNameOrUser(name.toLocaleLowerCase())

    return report
  }
}

export { ListMembersHistoricUseCase };
