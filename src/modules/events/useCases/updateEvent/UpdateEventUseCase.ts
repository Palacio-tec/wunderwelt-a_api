import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateEventDTO } from "@modules/events/dtos/ICreateEventDTO";
import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";

@injectable()
class UpdateEventUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("EventsLevelsRepository")
    private eventsLevelsRepository: IEventsLevelsRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("LevelsRepository")
    private levelsRepository: ILevelsRepository,

    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,
  ) {}

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
    }: ICreateEventDTO,
    user_id: string
  ): Promise<Event> {
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
    });

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

          const { name, email } = queue.user;

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

          this.mailProvider.sendMail(
            email,
            'Abriu uma vaga para a aula que você queria! Aproveite!',
            variables,
            templatePath
          );
        });
      }
    }

    return event;
  }
}

export { UpdateEventUseCase };
