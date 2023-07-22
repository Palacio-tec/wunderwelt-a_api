
import { container, inject, injectable } from "tsyringe";
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
import { SendMailWithLog } from "@utils/sendMailWithLog";

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

  async execute(date: Date, isTest = false, fakeData ?: any): Promise<void> {
    const sendNewsletterParameter = await this.parametersRepository
      .findByReference('SendNewsletter');

    if (!sendNewsletterParameter) return

    let dateToSendNewsletter = this.dateProvider.dateNow()
    if (sendNewsletterParameter.value) {
      dateToSendNewsletter = this.dateProvider.dateNow(sendNewsletterParameter.value)
    }

    if (date < dateToSendNewsletter && !isTest) return

    const nextExecutionDate = this.dateProvider.addDaysInDate(
      dateToSendNewsletter,
      NUMBER_OF_DAYS_FOR_NEXT_SHIPMENT
    )
    const nextExecutionDateFormatted = this.dateProvider.parseFormat(
      nextExecutionDate,
      'YYYY-MM-DD'
    )

    const initialEventDate = this.dateProvider.getNextDay(date, 2)

    const day = this.dateProvider.getDay(initialEventDate)
    const month = this.dateProvider.getMonth(initialEventDate) + 1
    const year = this.dateProvider.getYear(initialEventDate)

    const hasPromotion = await this.promotionsRepository
      .findByDate(`${this.dateProvider.getYear(date)}-${String(this.dateProvider.getMonth(date) + 1).padStart(2, '0')}-${String(this.dateProvider.getDay(date)).padStart(2, '0')}`)

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

    const sendMailWithLog = container.resolve(SendMailWithLog);

    const mailData = await formatValues(events)

    const variables = {
      mailData,
      hasPromotion: true,
      message: hasPromotion?.message || null,
      coupon: hasPromotion?.coupon || null,
      user_id: null
    };

    if (isTest) {
      variables.message = fakeData.message

      await this.mailProvider.sendMail({
        to: fakeData.to,
        subject: '[TESTE] - Confira as aulas incríveis que estão por vir',
        variables,
        path: templatePath,
      });

      return
    }

    const allUsers = await this.usersRepository.findAllStudentAndTeacherUsers()

    if (allUsers) {
      const usersChunk = spliceIntoChunks(allUsers, 40)

      for (let index = 0; index < usersChunk.length; index++) {
        const allUsers = usersChunk[index];

        allUsers.map((user) => {
          variables.user_id = user.id

          sendMailWithLog.execute({
            to: user.email,
            subject: 'Confira as aulas incríveis que estão por vir',
            variables,
            path: templatePath,
            mailLog: {
              userId: user.id
            },
          })
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
