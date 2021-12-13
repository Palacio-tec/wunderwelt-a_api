import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { Statement } from "@modules/statements/infra/typeorm/entities/Statement";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { AppError } from "@shared/errors/AppError";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";

interface IResponse {
  statement: Statement[];
  balance: number;
  expirationDate: string;
}

@injectable()
class GetUserBalanceUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,
  ) {}

  async execute(user_id: string, withStatement: boolean): Promise<IResponse> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    const userHour = await this.hoursRepository.findByUser(user_id);

    if (!userHour) {
      throw new AppError("User does not has credit");
    }

    const balance = await this.statementsRepository.getUserBalance({
      user_id,
      with_statement: withStatement,
    });

    Object.assign(balance, {
      expirationDate: userHour.expiration_date,
    });

    return balance as IResponse;
  }
}

export { GetUserBalanceUseCase };
