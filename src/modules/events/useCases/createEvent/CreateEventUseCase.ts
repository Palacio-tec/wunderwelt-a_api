import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateEventDTO } from "@modules/events/dtos/ICreateEventDTO";
import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";

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

    @inject("MailProvider")
    private mailProvider: IMailProvider,
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

    const formatedStartDate = this.dateProvider.formatInDate(event.start_date);
    
    const dateTimeFormated = this.dateProvider.parseFormat(event.start_date, "DD.MM.YYYY [às] HH:mm")

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "teacherEventCreated.hbs"
    );

    const { name, email } = teacherExists;

    const variables = {
      name,
      title,
      dateTime: dateTimeFormated,
    };

    this.mailProvider.sendMail(
      email,
      `Aula incluída - ${title}`,
      variables,
      templatePath
    );

    const content = `Nova aula incluída - ${title} para o dia ${formatedStartDate}`;

    const studentUsers = await this.usersRepository.findAllStudentUsers();

    return event;
  }
}

export { CreateEventUseCase };
