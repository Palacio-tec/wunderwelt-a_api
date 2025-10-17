import { container, inject, injectable } from "tsyringe";
import { resolve } from "path";

import { AppError } from "@shared/errors/AppError";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { createCalendarEvent } from "@utils/createCalendarEvent";
import { SendMailWithLog } from "@utils/sendMailWithLog";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

@injectable()
class CanceledEventUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,
  
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,
    
    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository,
  ) {}

  private async __sendMail(event: Event) {
    const { start_date, end_date, title, teacher_id, instruction } = event;

    const duration = this.dateProvider.differenceInMinutes(start_date, end_date)
    const dateTimeFormatted = this.dateProvider.parseFormat(event.start_date, "DD-MM-YYYY [às] HH:mm")

    const teacher = await this.usersRepository.findById(teacher_id);

    if (!teacher.receive_email) {
      return
    }

    const { name, email } = teacher;

    const variables = {
      name,
      title,
      dateTime: dateTimeFormatted,
      duration,
    };

    const calendarEvent = {
      content: await createCalendarEvent({
        id: event.id,
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

    const templateName = "cancel_event_teacher"

    const templates = await this.templatesRepository.findTemplateAndBase(
      templateName
    );

    sendMailWithLog.execute({
      to: email,
      subject: `Aula cancelada - ${dateTimeFormatted} - ${title}`,
      variables,
      calendarEvent,
      mailLog: {
        userId: teacher_id
      },
      template: templates.get(templateName).body,
      base: templates.get("base").body
    })

    return
  }

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

    await this.__sendMail(event)

    return event;
  }
}

export { CanceledEventUseCase };
