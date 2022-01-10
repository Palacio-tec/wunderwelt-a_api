import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { resolve } from "path";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
@injectable()
class CancelEventUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

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
  ) {}

  async execute(
    id: string,
    mailMessage: string,
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

    const { start_date, credit } = eventExists;

    const schedulesExists = await this.schedulesRepository.findByEventId(id);

    if (schedulesExists.length > 0) {
      const day = this.dateProvider.formatInDate(start_date);

      const templatePath = resolve(
        __dirname,
        "..",
        "..",
        "views",
        "emails",
        "cancelEvent.hbs"
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
          `Aula Cancelada - ${eventExists.title}`,
          variables,
          templatePath
        );

        await this.statementsRepository.create({
          amount: credit,
          description: `Reembolso de aula cancelada. ${eventExists.title} - ${day}`,
          type: OperationEnumTypeStatement.DEPOSIT,
          user_id: schedule.user_id,
        });

        const hours = await this.hoursRepository.findByUser(schedule.user_id);

        hours.amount = Number(hours.amount) + credit;

        await this.hoursRepository.update(hours);
      });
    }

    eventExists.is_canceled = true;

    const event = await this.eventsRepository.create({
      id,
      title: eventExists.title,
      description: eventExists.description,
      link: eventExists.link,
      start_date: eventExists.start_date,
      end_date: eventExists.end_date,
      student_limit: Number(eventExists.student_limit),
      teacher_id: eventExists.teacher_id,
      instruction: eventExists.instruction,
      is_canceled: eventExists.is_canceled,
      credit: eventExists.credit,
      request_subject: eventExists.request_subject,
      minimum_number_of_students: Number(eventExists.minimum_number_of_students),
    });

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "cancelEvent.hbs"
    );

    const { teacher_id, title } = event;

    const eventTeacher = await this.usersRepository.findById(teacher_id);

    const variables = {
      name: eventTeacher.name,
      mailMessage: `A aula "${title}" agendada para o dia ${this.dateProvider.parseFormat(start_date, "DD-MM-YYYY [às] HH:mm")} foi cancelada.`,
    };

    this.mailProvider.sendMail(
      eventTeacher.email,
      `Aula cancelada - ${title}`,
      variables,
      templatePath
    );

    return event;
  }
}

export { CancelEventUseCase };
