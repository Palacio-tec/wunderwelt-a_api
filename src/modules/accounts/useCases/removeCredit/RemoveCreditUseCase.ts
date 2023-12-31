import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { ISendGiftDTO } from "@modules/accounts/dtos/ISendGiftDTO";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";

interface IRemoveCreditProps {
  amount: number;
  user_id: string;
}
@injectable()
class RemoveCreditUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,
  ) {}

  private async _removeCredit({ amount, user_id }: IRemoveCreditProps): Promise<void> {
    const user = await this.usersRepository.findById(user_id)

    const newBalance = (Number(user.credit) - Number(amount))
  
    await this.usersRepository.create({
      ...user,
      credit: newBalance < 0 ? 0 : newBalance
    })

    return
  }

  async execute({
    credit,
    users,
    admin_id,
  }: ISendGiftDTO): Promise<void> {
    credit = Number(credit);
    const user = await this.usersRepository.findById(admin_id);

    if (!user) {
      throw new AppError("User does not exists");
    }

    if (!user.is_admin) {
      throw new AppError("Only administrators could be send a gift");
    }

    users.map(async (user) => {
      const { user_id } = user;
    
      const student = await this.usersRepository.findById(user_id);

      if (!student) {
        return false;
      }

      this.statementsRepository.create({
        amount: credit,
        description: `Você teve ${credit} crédito${credit > 1 ? 's' : ''} removidos`,
        type: OperationEnumTypeStatement.WITHDRAW,
        user_id,
      });

      this._removeCredit({
        amount: Number(credit),
        user_id
      })

      if (!student.receive_email) {
        return false
      }

      const templatePath = resolve(
        __dirname,
        "..",
        "..",
        "views",
        "emails",
        "removeCredit.hbs"
      );
  
      const { name, email } = student;
  
      const variables = {
        name,
        credit,
        plural: credit > 1
      };
  
      this.mailProvider.sendMail({
        to: email,
        subject: "Os seus créditos foram reajustados",
        variables,
        path: templatePath
      });
    });
  }
}

export { RemoveCreditUseCase };
