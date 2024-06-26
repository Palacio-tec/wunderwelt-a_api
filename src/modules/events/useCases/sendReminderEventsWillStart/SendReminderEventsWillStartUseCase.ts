
import { container, inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { SendMailWithLog } from "@utils/sendMailWithLog";
import { INotificationsRepository } from '@modules/notifications/repositories/INotificationsRepository'

@injectable()
class SendReminderEventsWillStartUseCase {
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
    const startDateFormated = this.dateProvider.parseFormatUTC(startDate);

    const endDate = this.dateProvider.addMinutesInDate(startDate, 59);
    const endDateFormated = this.dateProvider.parseFormatUTC(endDate);

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

    const sendMailWithLog = container.resolve(SendMailWithLog);

    events.map(async (event) => {
      const schedules = await this.schedulesRepository.findByEventId(event.event_id);
      
      const { title, link, start_date, instruction } = event;

      const time = this.dateProvider.formatInHour(start_date)

      const linkInfo = link.split(/\r?\n/)

      let newLink = ''

      linkInfo.forEach(info => {
        if (info.includes('http')) {
          newLink += `<br /><a href='${info}'>${info}</a>`
        } else {
          newLink += `<br /><text>${info}</text>`
        }
      })

      const instructionInfo = instruction.split(/\r?\n/)

      let instructionHTML = ''

      instructionInfo.forEach(info => {
        if (info.includes('http')) {
          instructionHTML += `<br /><a href='${info}'>${info}</a>`
        } else {
          instructionHTML += `<br /><text>${info}</text>`
        }
      })

      schedules.map(async (schedule) => {
        const { user } = schedule;

        if (user.receive_email) {
          const variables = {
            name: user.name,
            title,
            link: newLink,
            time,
            hasInstruction: !!instruction,
            instruction: instructionHTML,
          };

          const subject = "A sua aula vai começar daqui a pouco!"

          await this.notificationsRepository.create({
            user_id: user.id,
            title: subject,
            path: templatePath,
            variables
          })

          sendMailWithLog.execute({
            to: user.email,
            subject,
            variables,
            path: templatePath,
            mailLog: {
              userId: user.id
            },
          })
        }
      })
    })
  }
}

export { SendReminderEventsWillStartUseCase };
