import { inject, injectable } from "tsyringe";
import { resolve } from "path";
import { format, parseISO } from "date-fns";

import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ICreateScheduleDTO } from "@modules/schedules/dtos/ICreateScheduleDTO";
import { Schedule } from "@modules/schedules/infra/typeorm/entities/Schedule";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";
import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";

@injectable()
class CreateScheduleUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository,
  ) {}

  async execute({
    event_id,
    user_id,
    subject,
  }: ICreateScheduleDTO): Promise<Schedule> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    const eventExists = await this.eventsRepository.findById(event_id);

    if (!eventExists) {
      throw new AppError("Event does not exists");
    }

    const { start_date, title, link, instruction, credit } = eventExists;

    const userHours = await this.hoursRepository.findByUser(user_id);

    if (!userHours) {
      throw new AppError("User does not have a record of credits");
    }

    if (userHours.amount < credit) {
      throw new AppError("User does not have enough credits", 400, "enough.hours");
    }

    const parsedStartDate = format(start_date, 'yyyy-MM-dd HH:mm');

    const scheduleDateAvailable =
      await this.schedulesRepository.findByEventDate(parsedStartDate, user_id);

    if (scheduleDateAvailable.length > 0) {
      throw new AppError("User already have an event on this date");
    }

    const queueExists = await this.queuesRepository.findByEventAndUser(
      event_id,
      user_id
    );

    if (queueExists) {
      await this.queuesRepository.delete(queueExists.id);
    }

    const schedule = await this.schedulesRepository.create({
      event_id,
      user_id,
      subject,
    });

    const day = this.dateProvider.formatInDate(start_date);
    const start_hour = this.dateProvider.formatInHour(start_date);

    await this.statementsRepository.create({
      amount: credit,
      description: `Inscrição na aula ${eventExists.title} - ${day}`,
      type: OperationEnumTypeStatement.WITHDRAW,
      user_id,
    });

    const hours = await this.hoursRepository.findByUser(user_id);

    hours.amount = Number(hours.amount) - credit;

    await this.hoursRepository.update(hours);

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "createSchedule.hbs"
    );

    const { name, email } = userExists;

    const variables = {
      name,
      title,
      day,
      start_hour,
      link,
      hasInstruction: !!instruction,
      instruction
    };

    this.mailProvider.sendMail(
      email,
      "Aula agendada",
      variables,
      templatePath
    );

    return schedule;
  }
}

export { CreateScheduleUseCase };
