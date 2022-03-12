
import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";

@injectable()
class SendEventsWillStartEmailUseCase {
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
    const startDateFormatted = this.dateProvider.parseFormatUTC(startDate);
    
    const endDate = this.dateProvider.addMinutesInDate(startDate, 59);
    const endDateFormatted = this.dateProvider.parseFormatUTC(endDate);

    // console.log( `[EventsWillStart - ${date}] startDate = '${startDateFormatted}' - endDate ='${endDateFormatted}'` )

    const events = await this.eventsRepository.findEventWillStart(
      startDateFormatted,
      endDateFormatted
    ); 

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "eventWillStart.hbs"
    );

    events.map(async (event) => {
      const schedules = await this.schedulesRepository.findByEventId(event.event_id);

      const { teacher_name, teacher_email, title, start_date, link } = event;

      const linkInfo = link.split(/\r?\n/)

      let newLink = ''

      linkInfo.forEach(info => {
        if (info.includes('http')) {
          newLink += `<br /><a href='${info}'>${info}</a>`
        } else {
          newLink += `<br /><text>${info}</text>`
        }
      });

      const time = this.dateProvider.formatInHour(start_date)

      const variables = {
        name: teacher_name,
        title,
        time,
        schedules,
        link: newLink,
      };

      this.mailProvider.sendMail(
        teacher_email,
        `Lista de alunos inscritos na aula - ${title} hoje às ${time}`,
        variables,
        templatePath
      );
    })
  }
}

export { SendEventsWillStartEmailUseCase };
