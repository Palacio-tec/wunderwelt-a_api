
import { inject, injectable } from "tsyringe";
import { format } from "date-fns";
import { resolve } from "path";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { EventsRepository } from "@modules/events/infra/typeorm/repositories/EventsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";

@injectable()
class SendReminderEventsWillStartUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,
  ) {}

  async execute(date: Date): Promise<void> {
    const reminderEventEmail = await this.parametersRepository.findByReference('ReminderEventEmail');

    const reminderEventEmailValue = Number(reminderEventEmail.value)

    const startDate = this.dateProvider.addHoursInDate(date, reminderEventEmailValue);
    const startDateFormated = this.dateProvider.parseFormatUTC(startDate);

    const endDate = this.dateProvider.addMinutesInDate(startDate, 59);
    const endDateFormated = this.dateProvider.parseFormatUTC(endDate);

    // console.log( `[EventsReminder - ${date}] startDate = '${startDateFormated}' - endDate ='${endDateFormated}'` )

    const events = await this.eventsRepository.findEventWillStart(
      startDateFormated,
      endDateFormated
    ); 

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "eventReminder.hbs"
    );

    events.map(async (event) => {
      const schedules = await this.schedulesRepository.findByEventId(event.event_id);
      
      const { title, link } = event;

      const linkInfo = link.split(/\r?\n/)

      let newLink = ''

      linkInfo.forEach(info => {
        if (info.includes('http')) {
          newLink += `<br /><a href='${info}'>${info}</a>`
        } else {
          newLink += `<br /><text>${info}</text>`
        }
      });

      schedules.map(async (schedule) => {
        const { user } = schedule;

        const variables = {
          name: user.name,
          title,
          link: newLink,
          time: reminderEventEmailValue,
        };
  
        this.mailProvider.sendMail(
          user.email,
          "A sua aula vai começar daqui a pouco!",
          variables,
          templatePath
        );
      })
    })
  }
}

export { SendReminderEventsWillStartUseCase };
