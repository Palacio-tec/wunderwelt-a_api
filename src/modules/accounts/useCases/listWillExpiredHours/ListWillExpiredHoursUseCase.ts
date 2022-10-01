
import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

@injectable()
class ListWillExpiredHoursUseCase {
  constructor(
    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("DateProvider")
    private dateProvider: IDateProvider,
  ) {}

  async execute(date: Date): Promise<void> {
    const nextDaysToVerify = 15;

    const startDate = this.dateProvider.addDaysInDate(date, nextDaysToVerify);
    const startDateFormated = this.dateProvider.parseFormatUTC(startDate);

    const endDate = this.dateProvider.addDaysInDate(startDate, 1);
    const endDateFormated = this.dateProvider.parseFormatUTC(endDate);

    const credits = await this.hoursRepository.findWillExpired(
      startDateFormated,
      endDateFormated
    ); 

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "creditWillExpired.hbs"
    );

    credits.map(async (credit) => {
        const variables = {
            name: credit.name,
            amount: credit.amount,
        };

        this.mailProvider.sendMail({
            to: credit.email,
            subject: "Existem créditos próximo do vencimento",
            variables,
            path: templatePath,
        });
    })
  }
}

export { ListWillExpiredHoursUseCase };
