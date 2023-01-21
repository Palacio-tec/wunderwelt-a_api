
import { container, inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { spliceIntoChunks } from "@utils/spliceIntoChunks";
import { sleep } from "@utils/sleep";
import { SendMailWithLog } from "@utils/sendMailWithLog";

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

  async execute(date: Date, addDays: number): Promise<void> {
    const startDate = this.dateProvider.addDaysInDate(date, addDays);
    const startDateFormatted = this.dateProvider.parseFormat(startDate, 'YYYY-MM-DD');

    const endDate = this.dateProvider.addDaysInDate(startDate, 1);
    const endDateFormatted = this.dateProvider.parseFormat(endDate, 'YYYY-MM-DD');

    const credits = await this.hoursRepository.findWillExpired(
      startDateFormatted,
      endDateFormatted
    ); 

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "creditWillExpired.hbs"
    );

    if (!credits) {
      return
    }

    const sendMailWithLog = container.resolve(SendMailWithLog);

    const creditsChunk = spliceIntoChunks(credits, 20)

    for (let index = 0; index < creditsChunk.length; index++) {
      const credits = creditsChunk[index];

      credits.map(async (credit) => {
        const variables = {
            name: credit.name,
            amount: credit.amount,
            days: addDays,
        };

        sendMailWithLog.execute({
          to: credit.email,
          subject: "Existem créditos próximo do vencimento",
          variables,
          path: templatePath,
          mailLog: {
            userId: credit.userId
          },
        })
      })

      await sleep(10)
    }
  }
}

export { ListWillExpiredHoursUseCase };
