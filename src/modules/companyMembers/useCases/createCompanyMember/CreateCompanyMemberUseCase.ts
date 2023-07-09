import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IConsumeCouponsDTO } from "@modules/coupons/dtos/IConsumeCouponDTO";
import { Coupon } from "@modules/coupons/infra/typeorm/entities/Coupon";
import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";
import { AppError } from "@shared/errors/AppError";
import { IfUserExistsAndIsAdmin } from "@utils/validations/ifUserExistsAndIsAdmin";
import { IfUserExists } from "@utils/validations/ifUserExists";
import { ICompanyMembersRepository } from "@modules/companyMembers/repositories/ICompanyMembersRepository";
import { CompanyMember } from "@modules/companyMembers/infra/typeorm/entities/CompanyMember";

interface ICreateCompanyMemberUseCaseProps {
  user_id: string;
  company_id: string;
  users: string[]
}

@injectable()
class CreateCompanyMemberUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CompanyMembersRepository")
    private companyMembersRepository: ICompanyMembersRepository,
  ) {}

  async execute({ user_id, company_id, users }: ICreateCompanyMemberUseCaseProps): Promise<CompanyMember[]> {
    const companyMembers = []
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

      if (userAlreadyIsACompanyMember) {
        throw new AppError(`User [${user}] is already a company member [${userAlreadyIsACompanyMember.company_id}]`)
      }
    }

    for (const user of users) {
      companyMembers.push(await this.companyMembersRepository.create({company_id, user_id: user}))
    }

    return companyMembers;
  }
}

export { CreateCompanyMemberUseCase };
