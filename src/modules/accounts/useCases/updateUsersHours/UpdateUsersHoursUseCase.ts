
import { inject, injectable } from "tsyringe";

import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";

@injectable()
class UpdateUsersHoursUseCase {
  constructor(
    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
  ) {}

  async execute(): Promise<void> {
    const hoursBalance = await this.hoursRepository.listAllBalance()

    hoursBalance.map(hour => {
        this.usersRepository.updateCreditById(hour.user_id, hour.amount)

        const amountExpired = Number(hour.credit) - Number(hour.amount)

        if (amountExpired > 0) {
          this.statementsRepository.create({
            amount: amountExpired,
            description: `${amountExpired} crédito${amountExpired > 1 ? 's' : ''} expir${amountExpired > 1 ? 'aram' : 'ou'}`,
            type: OperationEnumTypeStatement.WITHDRAW,
            user_id: hour.user_id,
          });
        }
    })
  }
}

export { UpdateUsersHoursUseCase };
