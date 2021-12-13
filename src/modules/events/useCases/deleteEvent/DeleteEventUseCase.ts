import { inject, injectable } from "tsyringe";
import { resolve } from "path";
import { parseISO } from "date-fns";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";

@injectable()
class DeleteEventUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("EventsLevelsRepository")
    private eventsLevelsRepository: IEventsLevelsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository
  ) {}

  async execute(
    id: string,
    user_id: string,
    mailMessage: string
  ): Promise<void> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be delete an event");
    }

    const eventExists = await this.eventsRepository.findById(id);

    if (!eventExists) {
      throw new AppError("Event does not exists");
    }

    const { start_date, end_date } = eventExists;

    const schedulesExists = await this.schedulesRepository.findByEventId(id);

    if (schedulesExists) {
      const eventDurationInHours = this.dateProvider.differenceInHours(
        start_date,
        end_date
      );

      const day = this.dateProvider.formatInDate(start_date);
      const start_hour = this.dateProvider.formatInHour(start_date);

      const templatePath = resolve(
        __dirname,
        "..",
        "..",
        "views",
        "emails",
        "deleteEvent.hbs"
      );

      schedulesExists.map(async (schedule) => {
        await this.schedulesRepository.deleteById(schedule.id);

        const { name, email } = schedule.user;

        const variables = {
          name,
          mailMessage,
        };

        await this.mailProvider.sendMail(
          email,
          "Aula Removida",
          variables,
          templatePath
        );

        await this.statementsRepository.create({
          amount: eventDurationInHours,
          description: `Reembolso de aula removida. ${eventExists.title} - ${day}`,
          type: OperationEnumTypeStatement.DEPOSIT,
          user_id: schedule.user_id,
        });

        const hours = await this.hoursRepository.findByUser(user_id);

        hours.amount = Number(hours.amount) + eventDurationInHours;

        const parameterExpirationTime =
          await this.parametersRepository.findByReference("ExpirationTime");

        hours.expiration_date = this.dateProvider.addDays(
          Number(parameterExpirationTime.value)
        );

        await this.hoursRepository.update(hours);
      });
    }

    await this.eventsLevelsRepository.deleteByEvent(id);

    await this.eventsRepository.delete(id);
  }
}

export { DeleteEventUseCase };
