
import { container, inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { SendMailWithLog } from "@utils/sendMailWithLog";
import { INotificationsRepository } from '@modules/notifications/repositories/INotificationsRepository'

@injectable()
class SendEventsWillStartEmailUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,

    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository,
  ) {}

  async execute(date: Date): Promise<void> {
    const reminderEventEmail = await this.parametersRepository.findByReference('ReminderEventEmail');

    const reminderEventEmailValue = Number(reminderEventEmail.value)

    const startDate = this.dateProvider.addHoursInDate(date, reminderEventEmailValue);
    const startDateFormatted = this.dateProvider.parseFormatUTC(startDate);
    
    const endDate = this.dateProvider.addMinutesInDate(startDate, 59);
    const endDateFormatted = this.dateProvider.parseFormatUTC(endDate);

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

    const sendMailWithLog = container.resolve(SendMailWithLog);

    events.map(async (event) => {
      const schedules = await this.schedulesRepository.findByEventId(event.event_id);

      const { teacher_name, teacher_email, title, start_date, link, teacher_id } = event;

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

      const subject = `Lista de alunos inscritos na aula - ${title} hoje às ${time}`

      const variables = {
        name: teacher_name,
        title,
        time,
        schedules,
        link: newLink,
      };

      await this.notificationsRepository.create({
        user_id: teacher_id,
        title: subject,
        path: templatePath,
        variables
      })

      sendMailWithLog.execute({
        to: teacher_email,
        subject,
        variables,
        path: templatePath,
        mailLog: {
          userId: teacher_id
        },
      })
    })
  }
}

export { SendEventsWillStartEmailUseCase };
