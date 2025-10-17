import { container, inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { createCalendarEvent } from "@utils/createCalendarEvent";
import { ISchedulesCreditsRepository } from "@modules/schedules/repositories/ISchedulesCreditsRepository";
import { SendMailWithLog } from "@utils/sendMailWithLog";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

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

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,

    @inject("SchedulesCreditsRepository")
    private schedulesCreditsRepository: ISchedulesCreditsRepository,

    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository,
  ) {}

  private async _deleteSchedule(schedule_id: string, user_id: string){
    const scheduleCredits = await this.schedulesCreditsRepository.findByScheduleId(schedule_id)
    const expirationTimeParameter = await this.parametersRepository.findByReference('CreditExtensionDays');
    const extensionDays = Number(expirationTimeParameter.value)

    let depositCredit = 0

    for (let index = 0; index < scheduleCredits.length; index++) {
      const { id, credit_id, amount_credit } = scheduleCredits[index];
     
      const credit = await this.hoursRepository.findById(credit_id)

      let newExpirationDate = credit.expiration_date

      if (credit.balance <= 0 && 
        this.dateProvider.parseFormat(newExpirationDate, 'YYYY-MM-DD') <= this.dateProvider.parseFormat(new Date(), 'YYYY-MM-DD')
      ) {
        newExpirationDate = this.dateProvider.addDays(extensionDays)
      }

      await this.hoursRepository.create({
        ...credit,
        balance: (Number(credit.balance) + Number(amount_credit)),
        expiration_date: newExpirationDate,
      })

      depositCredit += Number(amount_credit)

      await this.schedulesCreditsRepository.delete(id)
    }

    await this.schedulesRepository.deleteById(schedule_id);

    if (depositCredit <= 0) {
      return
    }

    await this.usersRepository.updateAddCreditById(user_id, depositCredit)
  }

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

    const sendMailWithLog = container.resolve(SendMailWithLog);

    const schedulesExists = await this.schedulesRepository.findByEventId(id);

    if (schedulesExists) {
      const eventDurationInHours = this.dateProvider.differenceInHours(
        start_date,
        end_date
      );

      const day = this.dateProvider.formatInDate(start_date);

      const templateName = "delete_event"

      const templates = await this.templatesRepository.findTemplateAndBase(
        templateName
      );

      schedulesExists.map(async (schedule) => {
        await this._deleteSchedule(schedule.id, schedule.user.id)

        const { name, email } = schedule.user;

        const variables = {
          name,
          mailMessage,
        };

        const calendarEvent = {
          content: await createCalendarEvent({
            id: eventExists.id,
            start: start_date,
            end: end_date,
            summary: eventExists.title,
            description: eventExists.instruction,
            location: 'Sala virtual',
            status: "CANCELLED",
            method: 'CANCEL',
            attendee: {
              name,
              email
            },
          }),
          method: 'CANCEL',
        }

        sendMailWithLog.execute({
          to: email,
          subject: "Aula Removida",
          variables,
          calendarEvent,
          mailLog: {
            userId: schedule.user.id
          },
          template: templates.get(templateName).body,
          base: templates.get("base").body
        })

        await this.statementsRepository.create({
          amount: eventDurationInHours,
          description: `Reembolso de aula removida. ${eventExists.title} - ${day}`,
          type: OperationEnumTypeStatement.DEPOSIT,
          user_id: schedule.user_id,
        });

        const hours = await this.hoursRepository.findByUser(user_id);

        hours.amount = Number(hours.amount) + Number(eventDurationInHours);

        const parameterExpirationTime =
          await this.parametersRepository.findByReference("ExpirationTime");

        hours.expiration_date = this.dateProvider.addDays(
          Number(parameterExpirationTime.value)
        );

        await this.hoursRepository.update(hours);
      });
    }

    const templateName = "cancel_event_teacher"

    const templates = await this.templatesRepository.findTemplateAndBase(
      templateName
    );

    const { teacher_id, title } = eventExists;

    const eventTeacher = await this.usersRepository.findById(teacher_id);

    const calendarEvent = {
      content: await createCalendarEvent({
        id: eventExists.id,
        start: start_date,
        end: end_date,
        summary: eventExists.title,
        description: eventExists.instruction,
        location: 'Sala virtual',
        status: "CANCELLED",
        method: 'CANCEL',
        attendee: {
          name: eventTeacher.name,
          email: eventTeacher.email
        },
      }),
      method: 'CANCEL',
    }

    const variables = {
      name: eventTeacher.name,
      mailMessage: `A aula "${title}" agendada para o dia ${this.dateProvider.parseFormat(start_date, "DD-MM-YYYY [às] HH:mm")} foi cancelada.`,
    };

    const subject = `Aula cancelada - ${title}`

    sendMailWithLog.execute({
      to: eventTeacher.email,
      subject,
      variables,
      calendarEvent,
      mailLog: {
        userId: teacher_id
      },
      template: templates.get(templateName).body,
      base: templates.get("base").body
    })

    await this.eventsLevelsRepository.deleteByEvent(id);

    await this.eventsRepository.delete(id);
  }
}

export { DeleteEventUseCase };
