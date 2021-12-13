import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";
import { AppError } from "@shared/errors/AppError";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";

@injectable()
class DeleteScheduleUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository
  ) {}

  async execute(eventId: string, user_id: string): Promise<void> {
    const scheduleExists = await this.schedulesRepository.findByEventIdAndUserId(eventId, user_id);

    if (!scheduleExists) {
      throw new AppError("Schedule does not exists");
    }

    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (scheduleExists.user_id !== user_id && !userExists.is_admin) {
      throw new AppError(
        "The schedule does not belong to this user and user isn't an admin"
      );
    }

    const parameterRefundTimeLimit =
      await this.parametersRepository.findByReference("RefundTimeLimit");

    const { event } = scheduleExists;

    const { credit, start_date } = event;

    const dateNow = this.dateProvider.dateNow();

    const untilEventStart = this.dateProvider.differenceInHours(
      dateNow,
      start_date
    );

    if (untilEventStart >= Number(parameterRefundTimeLimit.value)) {
      await this.statementsRepository.create({
        amount: credit,
        description: `Reembolso por cancelar a inscrição da aula ${event.title}`,
        type: OperationEnumTypeStatement.DEPOSIT,
        user_id,
      });

      const hours = await this.hoursRepository.findByUser(user_id);

      hours.amount = Number(hours.amount) + credit;

      await this.hoursRepository.update(hours);
    }

    await this.schedulesRepository.deleteById(scheduleExists.id);

    const queues = await this.queuesRepository.findByEvent(event.id);

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
          "Vaga disponível",
          variables,
          templatePath
        );
      });
    }
  }
}

export { DeleteScheduleUseCase };
