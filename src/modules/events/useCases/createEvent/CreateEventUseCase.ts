import { container, inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateEventDTO } from "@modules/events/dtos/ICreateEventDTO";
import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { createCalendarEvent } from "@utils/createCalendarEvent";
import { SendMailWithLog } from "@utils/sendMailWithLog";
import { INotificationsRepository } from '@modules/notifications/repositories/INotificationsRepository'
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

@injectable()
class CreateEventUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("EventsLevelsRepository")
    private eventsLevelsRepository: IEventsLevelsRepository,

    @inject("LevelsRepository")
    private levelsRepository: ILevelsRepository,

    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository,

    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository,
  ) {}

  async execute(
    {
      title,
      description,
      link,
      start_date,
      end_date,
      student_limit,
      teacher_id,
      instruction,
      credit,
      levels,
      request_subject,
      minimum_number_of_students,
      has_highlight,
      for_teachers,
      modality,
      description_formatted,
      class_subject_id
    }: ICreateEventDTO,
    user_id: string
  ): Promise<Event> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be create an event");
    }

    const teacherExists = await this.usersRepository.findById(teacher_id);

    if (!teacherExists) {
      throw new AppError("Teacher does not exists");
    }

    if (!teacherExists.is_teacher) {
      throw new AppError("The teacher_id is not from a teacher");
    }

    const dateNow = this.dateProvider.dateNow();

    if (!this.dateProvider.comparaIfBefore(dateNow, start_date)) {
      throw new AppError("Start date must be equal or greater than now");
    }

    if (!this.dateProvider.comparaIfBefore(start_date, end_date)) {
      throw new AppError("Start date is greater than end date");
    }

    const parseStartDate = this.dateProvider.parseISO(start_date);
    const parseEndDate = this.dateProvider.parseISO(end_date);

    const event = await this.eventsRepository.create({
      title,
      description,
      link,
      start_date: parseStartDate,
      end_date: parseEndDate,
      student_limit,
      teacher_id,
      credit,
      instruction,
      request_subject,
      minimum_number_of_students,
      has_highlight,
      for_teachers,
      modality,
      description_formatted,
      class_subject_id
    });

    const event_id = event.id;

    await this.eventsLevelsRepository.deleteByEvent(event_id);

    if (levels) {
      levels.split(",").map(async (level_id: string) => {
        const levelExist = await this.levelsRepository.findById(level_id);

        if (!levelExist) {
          throw new AppError("Level does not exists");
        }

        await this.eventsLevelsRepository.create({ event_id, level_id });
      });
    }
    
    const dateTimeFormatted = this.dateProvider.parseFormat(event.start_date, "DD-MM-YYYY [às] HH:mm")

    const duration = this.dateProvider.differenceInMinutes(event.start_date, event.end_date)

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "teacherEventCreated.hbs"
    );

    const { name, email, id } = teacherExists;

    const variables = {
      name,
      title,
      dateTime: dateTimeFormatted,
      duration,
    };

    const calendarEvent = {
      content: await createCalendarEvent({
        id: event_id,
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

    const subject = `Nova aula - ${dateTimeFormatted} - ${title}`

    await this.notificationsRepository.create({
      user_id: id,
      title: subject,
      path: templatePath,
      variables
    })

    const sendMailWithLog = container.resolve(SendMailWithLog);

    const templateName = "teacher_event_created"

    const templates = await this.templatesRepository.findTemplateAndBase(
      templateName
    );

    sendMailWithLog.execute({
      to: email,
      subject: templates.get(templateName).subject,
      variables,
      calendarEvent,
      mailLog: {
        userId: teacher_id
      },
      template: templates.get(templateName).body,
      base: templates.get("base").body
    })

    return event;
  }
}

export { CreateEventUseCase };
