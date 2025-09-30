import { container, inject, injectable } from "tsyringe";

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
import { ISchedulesCreditsRepository } from "@modules/schedules/repositories/ISchedulesCreditsRepository";
import { SendMailWithLog } from "@utils/sendMailWithLog";
import { createCalendarEvent } from "@utils/createCalendarEvent";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

@injectable()
class RemoveScheduleUseCase {
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
    private hoursRepository: IHoursRepository,

    @inject("SchedulesCreditsRepository")
    private schedulesCreditsRepository: ISchedulesCreditsRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository
  ) {}

  private async __deleteSchedule(schedule_id: string, user_id: string) {
    const scheduleCredits =
      await this.schedulesCreditsRepository.findByScheduleId(schedule_id);
    const expirationTimeParameter =
      await this.parametersRepository.findByReference("CreditExtensionDays");
    const extensionDays = Number(expirationTimeParameter.value);

    let depositCredit = 0;

    for (let index = 0; index < scheduleCredits.length; index++) {
      const { id, credit_id, amount_credit } = scheduleCredits[index];

      const credit = await this.hoursRepository.findById(credit_id);

      let newExpirationDate = credit.expiration_date;

      if (
        credit.balance <= 0 &&
        this.dateProvider.parseFormat(newExpirationDate, "YYYY-MM-DD") <=
          this.dateProvider.parseFormat(new Date(), "YYYY-MM-DD")
      ) {
        newExpirationDate = this.dateProvider.addDays(extensionDays);
      }

      await this.hoursRepository.create({
        ...credit,
        balance: Number(credit.balance) + Number(amount_credit),
        expiration_date: newExpirationDate,
      });

      depositCredit += Number(amount_credit);

      await this.schedulesCreditsRepository.delete(id);
    }

    await this.schedulesRepository.deleteById(schedule_id);

    if (depositCredit <= 0) {
      return;
    }

    await this.usersRepository.updateAddCreditById(user_id, depositCredit);
  }

  private async __refundCredits(
    user_id: string,
    title: string,
    credit: number,
    start_date: Date
  ) {
    const parameterRefundTimeLimit =
      await this.parametersRepository.findByReference("RefundTimeLimit");

    const dateNow = this.dateProvider.dateNow();

    const untilEventStart = this.dateProvider.differenceInHours(
      dateNow,
      start_date
    );

    if (untilEventStart >= Number(parameterRefundTimeLimit.value)) {
      this.statementsRepository.create({
        amount: credit,
        description: `Reembolso por cancelamento referente inscrição da aula ${title}`,
        type: OperationEnumTypeStatement.DEPOSIT,
        user_id: user_id,
      });
    }
  }

  private async __queueAvailable(event_id: string) {
    const queues = await this.queuesRepository.findByEvent(event_id);

    if (queues) {
      const queueTemplate = await this.templatesRepository.findLatestByTemplate(
        "queue_available_event"
      );

      queues.map((queue) => {
        const { name, email, receive_email } = queue.user;

        if (!receive_email) {
          return;
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

        this.mailProvider.sendMail({
          to: email,
          subject: "Abriu uma vaga para a aula que você queria! Aproveite!",
          variables,
          template: queueTemplate.body,
        });
      });
    }
  }

  private async __sendMail(
    user_id: string,
    name: string,
    email: string,
    title: string,
    event_id: string,
    mailDescription: string
  ) {
    const template = await this.templatesRepository.findLatestByTemplate(
      "student_removed"
    );

    const event = await this.eventsRepository.findById(event_id);

    const sendMailWithLog = container.resolve(SendMailWithLog);

    const variables = {
      name,
      title,
      hasMailDescription: !!mailDescription,
      mailDescription,
    };

    const calendarEvent = {
      content: await createCalendarEvent({
        id: event_id,
        start: event.start_date,
        end: event.end_date,
        summary: title,
        description: event.instruction,
        location: "Sala virtual",
        status: "CANCELLED",
        method: "CANCEL",
        attendee: {
          name,
          email,
        },
      }),
      method: "CANCEL",
    };

    sendMailWithLog.execute({
      to: email,
      subject: "Inscrição na aula realizada com sucesso!",
      variables,
      template: template.body,
      calendarEvent,
      mailLog: {
        userId: user_id,
      },
    });
  }

  async execute(
    eventId: string,
    student_id: string,
    admin_id: string,
    mailDescription: string
  ): Promise<void> {
    const scheduleExists =
      await this.schedulesRepository.findByEventIdAndUserId(
        eventId,
        student_id
      );

    if (!scheduleExists) {
      throw new AppError("Schedule does not exists");
    }

    const studentExists = await this.usersRepository.findById(student_id);

    if (!studentExists) {
      throw new AppError("Student does not exists");
    }

    const adminExists = await this.usersRepository.findById(admin_id);

    if (!adminExists) {
      throw new AppError("User does not exists");
    }

    if (!adminExists.is_admin) {
      throw new AppError("User is not an admin");
    }

    await this.__deleteSchedule(scheduleExists.id, student_id);

    const { credit, start_date, title } = scheduleExists.event;

    await this.__refundCredits(student_id, title, credit, start_date);

    await this.__queueAvailable(eventId);

    this.__sendMail(
      student_id,
      studentExists.name,
      studentExists.email,
      title,
      eventId,
      mailDescription
    );
  }
}

export { RemoveScheduleUseCase };
