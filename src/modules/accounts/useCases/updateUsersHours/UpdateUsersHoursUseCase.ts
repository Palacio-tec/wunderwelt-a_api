
import { inject, injectable } from "tsyringe";

import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

@injectable()
class UpdateUsersHoursUseCase {
  constructor(
    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute(): Promise<void> {
    const hoursBalance = await this.hoursRepository.listAllBalance()

    hoursBalance.map(hour => {
        this.usersRepository.updateCreditById(hour.user_id, hour.amount)
    })
  }
}

export { UpdateUsersHoursUseCase };
