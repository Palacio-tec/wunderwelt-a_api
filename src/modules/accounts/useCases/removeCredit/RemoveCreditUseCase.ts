import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { ISendGiftDTO } from "@modules/accounts/dtos/ISendGiftDTO";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

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

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository
  ) {}

  private async _removeCredit({
    amount,
    user_id,
  }: IRemoveCreditProps): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    const newBalance = Number(user.credit) - Number(amount);

    await this.usersRepository.create({
      ...user,
      credit: newBalance < 0 ? 0 : newBalance,
    });

    const creditsList = await this.hoursRepository.listAvailableByUser(user_id);

    let remainingAmount = amount;

    for (const credit of creditsList) {
      let newBalance = Number(credit.balance) - remainingAmount;

      if (remainingAmount >= Number(credit.balance)) {
        newBalance = 0;
      }

      this.hoursRepository.update({
        ...credit,
        balance: newBalance,
      });

      remainingAmount -= Number(credit.balance);

      if (remainingAmount <= 0) {
        break;
      }
    }

    return;
  }

  async execute({ credit, users, admin_id }: ISendGiftDTO): Promise<void> {
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
        description: `Você teve ${credit} crédito${
          credit > 1 ? "s" : ""
        } removidos`,
        type: OperationEnumTypeStatement.WITHDRAW,
        user_id,
      });

      this._removeCredit({
        amount: Number(credit),
        user_id,
      });

      if (!student.receive_email) {
        return false;
      }

      const template = await this.templatesRepository.findLatestByTemplate(
        "remove_credit"
      );

      const { name, email } = student;

      const variables = {
        name,
        credit,
        plural: credit > 1,
      };

      this.mailProvider.sendMail({
        to: email,
        subject: "Os seus créditos foram reajustados",
        variables,
        template: template.body,
      });
    });
  }
}

export { RemoveCreditUseCase };
