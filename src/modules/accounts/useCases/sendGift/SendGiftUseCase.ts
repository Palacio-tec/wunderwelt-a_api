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
  ) {}

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

      const hours = await this.hoursRepository.findByUser(user_id);

      if (!hours) {
        return false;
      }

      await this.statementsRepository.create({
        amount: credit,
        description: `Você foi presenteado com ${credit} crédito${credit > 1 ? 's' : ''}`,
        type: OperationEnumTypeStatement.DEPOSIT,
        user_id
      });

      hours.amount = Number(hours.amount) + credit;

      const parameterExpirationTime =
        await this.parametersRepository.findByReference("ExpirationTime");

      hours.expiration_date = this.dateProvider.addDays(
        Number(parameterExpirationTime.value)
      );

      await this.hoursRepository.update(hours);

      const templatePath = resolve(
        __dirname,
        "..",
        "..",
        "views",
        "emails",
        "sendGift.hbs"
      );
  
      const { name, email } = student;
  
      const variables = {
        name,
        credit,
        plural: credit > 1
      };
  
      this.mailProvider.sendMail(
        email,
        "Você ganhou um presente!",
        variables,
        templatePath
      );
    });
  }
}

export { SendGiftUseCase };
