import { container, inject, injectable } from "tsyringe";

import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { spliceIntoChunks } from "@utils/spliceIntoChunks";
import { sleep } from "@utils/sleep";
import { SendMailWithLog } from "@utils/sendMailWithLog";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

@injectable()
class ListWillExpiredHoursUseCase {
  constructor(
    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository
  ) {}

  async execute(date: Date, addDays: number): Promise<void> {
    const startDate = this.dateProvider.addDaysInDate(date, addDays);
    const startDateFormatted = this.dateProvider.parseFormat(
      startDate,
      "YYYY-MM-DD"
    );

    const endDate = this.dateProvider.addDaysInDate(startDate, 1);
    const endDateFormatted = this.dateProvider.parseFormat(
      endDate,
      "YYYY-MM-DD"
    );

    const credits = await this.hoursRepository.findWillExpired(
      startDateFormatted,
      endDateFormatted
    );

    if (!credits) {
      return;
    }

    const templateName = "credit_will_expired"

    const templates = await this.templatesRepository.findTemplateAndBase(
      templateName
    );

    const sendMailWithLog = container.resolve(SendMailWithLog);

    const creditsChunk = spliceIntoChunks(credits, 20);

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
          subject: templates.get(templateName).subject,
          variables,
          template: templates.get(templateName).body,
          base: templates.get("base").body,
          mailLog: {
            userId: credit.userId,
          },
        });
      });

      await sleep(10);
    }
  }
}

export { ListWillExpiredHoursUseCase };
