
import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IPromotionsRepository } from "@modules/promotions/repositories/IPromotionsRepository";
import { spliceIntoChunks } from "@utils/spliceIntoChunks";
import { sleep } from "@utils/sleep";

const NUMBER_OF_DAYS_FOR_NEXT_SHIPMENT = 14

type ValuesFormatted = {
  id: string;
  title: string;
  description: string;
  credit: number;
  date: string;
}

async function formatValues(events: Event[]): Promise<ValuesFormatted[]> {
  const result = await Promise.all(
    events.map(async (event): Promise<ValuesFormatted> => {
      const { id, title, start_date, description, credit, event_levels } = event;

      let startDateFormatted = new Intl
        .DateTimeFormat('pt-BR', {
          weekday: "long",
          day: "2-digit",
          month: "long",
          hour: "numeric",
          minute: 'numeric',
          timeZone: 'America/Sao_Paulo'
        }).format(start_date)
      startDateFormatted = startDateFormatted.charAt(0).toUpperCase() + startDateFormatted.slice(1)

      return {
        id,
        title,
        description,
        credit,
        date: startDateFormatted,
      }
    })
  )

  return result
}

@injectable()
class SendEventsNewsletterUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("PromotionsRepository")
    private promotionsRepository: IPromotionsRepository
  ) {}

  async execute(date: Date): Promise<void> {
    const sendNewsletterParameter = await this.parametersRepository
      .findByReference('SendNewsletter');

    if (!sendNewsletterParameter) return

    let dateToSendNewsletter = this.dateProvider.dateNow()
    if (sendNewsletterParameter.value) {
      dateToSendNewsletter = this.dateProvider.dateNow(sendNewsletterParameter.value)
    }

    if (date < dateToSendNewsletter) return

    const nextExecutionDate = this.dateProvider.addDaysInDate(
      dateToSendNewsletter,
      NUMBER_OF_DAYS_FOR_NEXT_SHIPMENT
    )
    const nextExecutionDateFormatted = this.dateProvider.parseFormat(
      nextExecutionDate,
      'YYYY-MM-DD'
    )

    const day = this.dateProvider.getDay(date)
    const month = this.dateProvider.getMonth(date) + 1
    const year = this.dateProvider.getYear(date)

    const hasPromotion = await this.promotionsRepository
      .findByDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)

    const events = await this.eventsRepository
      .findByHighlightAndWillStart(year, month, day); 

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "newsletter.hbs"
    );

    const mailData = await formatValues(events)

    const variables = {
      mailData,
      hasPromotion: !!hasPromotion,
      message: hasPromotion?.message || null,
      coupon: hasPromotion?.coupon || null
    };

    const allUsers = await this.usersRepository.findAllStudentUsers()

    if (allUsers) {
      const usersChunk = spliceIntoChunks(allUsers, 40)

      for (let index = 0; index < usersChunk.length; index++) {
        const allUsers = usersChunk[index];

        allUsers.map((user) => {
          this.mailProvider.sendMail({
            to: user.email,
            subject: 'Confira as aulas incríveis que estão por vir',
            variables,
            path: templatePath,
          });
        })

        await sleep(10)
      }
    }

    this.parametersRepository.create({
      ...sendNewsletterParameter,
      value: nextExecutionDateFormatted
    })
  }
}

export { SendEventsNewsletterUseCase };
