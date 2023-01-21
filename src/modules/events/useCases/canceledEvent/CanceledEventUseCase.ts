import { container, inject, injectable } from "tsyringe";
import { resolve } from "path";

import { AppError } from "@shared/errors/AppError";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { createCalendarEvent } from "@utils/createCalendarEvent";
import { SendMailWithLog } from "@utils/sendMailWithLog";

@injectable()
class CanceledEventUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,
  
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("MailProvider")
    private mailProvider: IMailProvider,
  ) {}

  async execute(id: string): Promise<Event> {
    const event = await this.eventsRepository.findByIdToCreate(id);

    if (!event) {
      throw new AppError("Event does not exists");
    }
    event.is_canceled = !event.is_canceled;

    await this.eventsRepository.create(event);

    if (!event.is_canceled) {
      return event
    }

    const { start_date, end_date, title, teacher_id, instruction } = event;
    const duration = this.dateProvider.differenceInMinutes(start_date, end_date)
    const dateTimeFormatted = this.dateProvider.parseFormat(event.start_date, "DD-MM-YYYY [às] HH:mm")

    const teacher = await this.usersRepository.findById(teacher_id);

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "teacherEventCreated.hbs"
    );

    const { name, email } = teacher;

    const variables = {
      name,
      title,
      dateTime: dateTimeFormatted,
      duration,
    };

    const calendarEvent = {
      content: await createCalendarEvent({
        id,
        start: start_date,
        end: end_date,
        summary: title,
        description: instruction,
        location: 'Sala virtual',
        status: "CONFIRMED",
        method: 'REQUEST',
        attendee: {
          name,
          email
        },
      }),
      method: 'REQUEST',
    }

    const sendMailWithLog = container.resolve(SendMailWithLog);

    sendMailWithLog.execute({
      to: email,
      subject: `Nova aula - ${dateTimeFormatted} - ${title}`,
      variables,
      path: templatePath,
      mailLog: {
        userId: teacher_id
      },
    })

    return event;
  }
}

export { CanceledEventUseCase };
