import { inject, injectable } from "tsyringe";

import { ISendGiftDTO } from "@modules/accounts/dtos/ISendGiftDTO";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

interface ICreateCreditProps {
  amount: number;
  user_id: string;
}
@injectable()
class SendGiftUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository
  ) {}

  private async _createCredit({
    amount,
    user_id,
  }: ICreateCreditProps): Promise<void> {
    const expirationTimeParameter =
      await this.parametersRepository.findByReference("ExpirationTime");
    const validityDays = Number(expirationTimeParameter.value);
    const expiration_date = this.dateProvider.addDays(validityDays);

    await this.hoursRepository.create({
      amount,
      user_id,
      balance: amount,
      expiration_date,
    });

    const user = await this.usersRepository.findById(user_id);

    await this.usersRepository.create({
      ...user,
      credit: Number(user.credit) + Number(amount),
    });

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
        description: `Você foi presenteado com ${credit} crédito${
          credit > 1 ? "s" : ""
        }`,
        type: OperationEnumTypeStatement.DEPOSIT,
        user_id,
        is_gift: true,
      });

      this._createCredit({
        amount: Number(credit),
        user_id,
      });

      if (!student.receive_email) {
        return false;
      }

      const templates = await this.templatesRepository.findTemplateAndBase(
        "send_gift"
      );

      const { name, email } = student;

      const variables = {
        name,
        credit,
        plural: credit > 1,
      };

      this.mailProvider.sendMail({
        to: email,
        subject: "Você ganhou um presente!",
        variables,
        template: templates.get("send_gift").body,
        base: templates.get("base").body,
      });
    });
  }
}

export { SendGiftUseCase };
