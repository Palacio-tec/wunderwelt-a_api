import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { Event } from "@modules/events/infra/typeorm/entities/Event";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import { container, inject, injectable } from "tsyringe";
import { resolve } from "path";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { createCalendarEvent } from "@utils/createCalendarEvent";
import { ISchedulesCreditsRepository } from "@modules/schedules/repositories/ISchedulesCreditsRepository";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { SendMailWithLog } from "@utils/sendMailWithLog";
import { INotificationsRepository } from '@modules/notifications/repositories/INotificationsRepository'
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

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

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("SchedulesCreditsRepository")
    private schedulesCreditsRepository: ISchedulesCreditsRepository,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,

    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository,

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

      this.schedulesCreditsRepository.delete(id)
    }

    await this.schedulesRepository.deleteById(schedule_id);

    if (depositCredit <= 0) {
      return
    }

    await this.usersRepository.updateAddCreditById(user_id, depositCredit)
  }

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

    const { title, start_date, end_date, instruction, credit, teacher_id } = eventExists;

    const sendMailWithLog = container.resolve(SendMailWithLog);

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

      const templateName = "cancel_event"

      const templates = await this.templatesRepository.findTemplateAndBase(
        templateName
      );

      schedulesExists.map(async (schedule) => {
        this._deleteSchedule(schedule.id, schedule.user.id)

        const { name, email, id, receive_email } = schedule.user;

        this.statementsRepository.create({
          amount: credit,
          description: `Reembolso de aula cancelada. ${title} - ${day}`,
          type: OperationEnumTypeStatement.DEPOSIT,
          user_id: schedule.user_id,
        });

        if (receive_email) {
          const variables = {
            name,
            mailMessage,
          };

          const calendarEvent = {
            content: await createCalendarEvent({
              id,
              start: start_date,
              end: end_date,
              summary: title,
              description: instruction,
              location: 'Sala virtual',
              status: "CANCELLED",
              method: 'CANCEL',
              attendee: {
                name,
                email
              }
            }),
            method: 'CANCEL',
          }

          const subject = `Aula Cancelada - ${title}`

          await this.notificationsRepository.create({
            user_id: id,
            title: subject,
            path: templatePath,
            variables
          })

          sendMailWithLog.execute({
            to: email,
            subject,
            variables,
            path: templatePath,
            calendarEvent,
            mailLog: {
              userId: schedule.user.id
            },
            template: templates.get(templateName).body,
            base: templates.get("base").body,
          })
        }
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
      modality: eventExists.modality,
      description_formatted: eventExists.description_formatted,
    });

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "cancelEvent.hbs"
    );

    const templateName = "cancel_event_teacher"

    const templates = await this.templatesRepository.findTemplateAndBase(
      templateName
    );

    const eventTeacher = await this.usersRepository.findById(teacher_id);

    if (eventTeacher.receive_email) {
      const variables = {
        name: eventTeacher.name,
        mailMessage: `A aula "${title}" agendada para o dia ${this.dateProvider.parseFormat(start_date, "DD-MM-YYYY [às] HH:mm")} foi cancelada.`,
      };

      const calendarEvent = {
        content: await createCalendarEvent({
          id,
          start: start_date,
          end: end_date,
          summary: title,
          description: instruction,
          location: 'Sala virtual',
          status: "CANCELLED",
          method: 'CANCEL',
          attendee: {
            name: eventTeacher.name,
            email: eventTeacher.email
          }
        }),
        method: 'CANCEL',
      }

      const subject = `Aula cancelada - ${title}`

      await this.notificationsRepository.create({
        user_id: teacher_id,
        title: subject,
        path: templatePath,
        variables
      })

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
    }

    return event;
  }
}

export { CancelEventUseCase };
