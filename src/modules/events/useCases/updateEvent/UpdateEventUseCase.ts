import { container, inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateEventDTO } from "@modules/events/dtos/ICreateEventDTO";
import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { createCalendarEvent } from "@utils/createCalendarEvent";
import { SendMailWithLog } from "@utils/sendMailWithLog";
import { INotificationsRepository } from '@modules/notifications/repositories/INotificationsRepository'
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";

interface ChangeTeacherProps {
  newTeacher: User,
  oldTeacherId: string,
  event: Event
}

@injectable()
class UpdateEventUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("EventsLevelsRepository")
    private eventsLevelsRepository: IEventsLevelsRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("LevelsRepository")
    private levelsRepository: ILevelsRepository,

    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository,

    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,
  ) {}

  private async __newTeacher(teacher: User, event: Event) {
    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "teacherEventCreated.hbs"
    );

    const dateTimeFormatted = this.dateProvider.parseFormat(event.start_date, "DD-MM-YYYY [às] HH:mm")
    const duration = this.dateProvider.differenceInMinutes(event.start_date, event.end_date)

    const variables = {
      name: teacher.name,
      title: event.title,
      dateTime: dateTimeFormatted,
      duration,
    };

    const calendarEvent = {
      content: await createCalendarEvent({
        id: event.id,
        start: event.start_date,
        end: event.end_date,
        summary: event.title,
        description: event.instruction,
        location: 'Sala virtual',
        status: "CONFIRMED",
        method: 'REQUEST',
        attendee: {
          name: teacher.name,
          email: teacher.email
        },
      }),
      method: 'REQUEST',
    }

    const subject = `Nova aula - ${dateTimeFormatted} - ${event.title}`

    await this.notificationsRepository.create({
      user_id: teacher.id,
      title: subject,
      path: templatePath,
      variables
    })

    const sendMailWithLog = container.resolve(SendMailWithLog);

    sendMailWithLog.execute({
      to: teacher.email,
      subject,
      variables,
      path: templatePath,
      calendarEvent,
      mailLog: {
        userId: teacher.id
      },
    })

    const reminderEventEmail = await this.parametersRepository.findByReference('PreviewEventEmail');
    const reminderEventEmailValue = Number(reminderEventEmail.value)

    if (this.dateProvider.differenceInHours(new Date(), event.start_date) <= reminderEventEmailValue) {
      const templatePath = resolve(
        __dirname,
        "..",
        "..",
        "views",
        "emails",
        "eventPreview.hbs"
      );
  
      const sendMailWithLog = container.resolve(SendMailWithLog);

      const schedules = await this.schedulesRepository.findByEventId(event.id);

      const subject = `Prévia da Lista de alunos inscritos na aula - ${event.title} ${dateTimeFormatted}`

      const variables = {
        name: teacher.name,
        title: event.title,
        datetime: dateTimeFormatted,
        schedules,
      };

      sendMailWithLog.execute({
        to: teacher.email,
        subject,
        variables,
        path: templatePath,
        mailLog: {
          userId: teacher.id
        },
      })
    }
  }
  private async __oldTeacher(teacherId: string, event: Event) {
    const teacher = await this.usersRepository.findById(teacherId)

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "cancelEvent.hbs"
    );

    const variables = {
      name: teacher.name,
      mailMessage: `A aula "${event.title}" agendada para o dia ${this.dateProvider.parseFormat(event.start_date, "DD-MM-YYYY [às] HH:mm")} foi cancelada.`,
    };

    const calendarEvent = {
      content: await createCalendarEvent({
        id: event.id,
        start: event.start_date,
        end: event.end_date,
        summary: event.title,
        description: event.instruction,
        location: 'Sala virtual',
        status: "CANCELLED",
        method: 'CANCEL',
        attendee: {
          name: teacher.name,
          email: teacher.email
        }
      }),
      method: 'CANCEL',
    }

    const subject = `Aula cancelada - ${event.title}`

    await this.notificationsRepository.create({
      user_id: teacher.id,
      title: subject,
      path: templatePath,
      variables
    })

    const sendMailWithLog = container.resolve(SendMailWithLog);

    sendMailWithLog.execute({
      to: teacher.email,
      subject,
      variables,
      path: templatePath,
      calendarEvent,
      mailLog: {
        userId: teacher.id
      },
    })
  }

  private async __changeTeacher({
    newTeacher,
    oldTeacherId,
    event
  }: ChangeTeacherProps) {
    await this.__newTeacher(newTeacher, event)
    await this.__oldTeacher(oldTeacherId, event)
  }

  async execute(
    {
      id,
      title,
      description,
      link,
      start_date,
      end_date,
      student_limit,
      teacher_id,
      instruction,
      credit,
      request_subject,
      minimum_number_of_students,
      levels,
      has_highlight,
      for_teachers,
      modality,
      description_formatted,
      class_subject_id,
    }: ICreateEventDTO,
    user_id: string
  ): Promise<Event> {
    let teacherExists: User | null = null
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("User is not administrators");
    }

    const eventExists = await this.eventsRepository.findById(id);

    if (!eventExists) {
      throw new AppError("Event does not exists");
    }

    const hasTeacherChanged = eventExists.teacher_id !== teacher_id

    if (hasTeacherChanged) {
      teacherExists = await this.usersRepository.findById(teacher_id);

      if (!teacherExists) {
        throw new AppError("Teacher does not exists");
      }

      if (!teacherExists.is_teacher) {
        throw new AppError("The teacher_id is not from a teacher");
      }
    }

    const sendMailWithLog = container.resolve(SendMailWithLog);

    if (eventExists.start_date.toISOString() !== start_date || eventExists.end_date.toISOString() !== end_date) {
      const eventTeacher = await this.usersRepository.findById(teacher_id);
      const dateTimeFormatted = this.dateProvider.parseFormat(start_date, "DD-MM-YYYY [às] HH:mm")
      const duration = this.dateProvider.differenceInMinutes(start_date, end_date)

      const templatePath = resolve(
        __dirname,
        "..",
        "..",
        "views",
        "emails",
        "teacherEventChange.hbs"
      );
  
      const variables = {
        name: eventTeacher.name,
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
            name: eventTeacher.name,
            email: eventTeacher.email,
          },
        }),
        method: 'REQUEST',
      }

      sendMailWithLog.execute({
        to: eventTeacher.email,
        subject: `Mudança de horário - ${title}`,
        variables,
        path: templatePath,
        calendarEvent,
        mailLog: {
          userId: teacher_id
        },
      })
    }

    const haveLimitIncrease = Number(eventExists.student_limit) < student_limit;

    const parseStartDate = this.dateProvider.parseISO(start_date);
    const parseEndDate = this.dateProvider.parseISO(end_date);

    const event = await this.eventsRepository.create({
      id,
      title,
      description,
      link,
      start_date: parseStartDate,
      end_date: parseEndDate,
      student_limit,
      teacher_id,
      credit,
      request_subject,
      minimum_number_of_students,
      instruction,
      has_highlight,
      for_teachers,
      modality,
      description_formatted,
      class_subject_id,
    });

    if (hasTeacherChanged) {
      await this.__changeTeacher({
        newTeacher: teacherExists,
        oldTeacherId: eventExists.teacher_id,
        event
      })
    }

    await this.eventsLevelsRepository.deleteByEvent(id);

    if (levels) {
      await Promise.all(
        levels.split(",").map(async (level_id: string) => {
          const levelExist = await this.levelsRepository.findById(level_id);

          if (!levelExist) {
            throw new AppError("Level does not exists");
          }

          await this.eventsLevelsRepository.create({ event_id: id, level_id });
        })
      )
    }

    if (haveLimitIncrease) {
      const queues = await this.queuesRepository.findByEvent(id);

      if (queues) {
        queues.map((queue) => {
          const templatePath = resolve(
            __dirname,
            "..",
            "..",
            "..",
            "queues",
            "views",
            "emails",
            "queueAvailableEvent.hbs"
          );

          const { name, email, id, receive_email } = queue.user;

          if (!receive_email) {
            return
          }

          const { title, start_date, link } = queue.event;

          const day = this.dateProvider.formatInDate(start_date);
          const start_hour = this.dateProvider.formatInHour(start_date);

          const variables = {
            name,
            title,
            day,
            start_hour,
            link,
          };

          sendMailWithLog.execute({
            to: email,
            subject: 'Abriu uma vaga para a aula que você queria! Aproveite!',
            variables,
            path: templatePath,
            mailLog: {
              userId: id
            },
          })
        });
      }
    }

    return event;
  }
}

export { UpdateEventUseCase };
