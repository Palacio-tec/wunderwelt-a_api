import { container, inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { createCalendarEvent } from "@utils/createCalendarEvent";
import { ISchedulesCreditsRepository } from "@modules/schedules/repositories/ISchedulesCreditsRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { SendMailWithLog } from "@utils/sendMailWithLog";
import { INotificationsRepository } from '@modules/notifications/repositories/INotificationsRepository'

@injectable()
class CancelEventWithoutStudentUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("SchedulesCreditsRepository")
    private schedulesCreditsRepository: ISchedulesCreditsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository,
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

  async execute(date: Date): Promise<void> {
    const studentlessPeriod = await this.parametersRepository.findByReference('StudentlessPeriod');
    const parameterRefundTimeLimit =
      await this.parametersRepository.findByReference("RefundTimeLimit");

    const studentlessPeriodValue = Number(studentlessPeriod.value);
    const parameterRefundTimeLimitValue = Number(parameterRefundTimeLimit.value) - 2;

    const startDate = this.dateProvider.parseISO(new Date()).toISOString();

    const endDate = this.dateProvider.addHoursInDate(date, studentlessPeriodValue);
    const endDateFormatted = this.dateProvider.parseISO(endDate).toISOString();

    const events = await this.eventsRepository.findEventWithoutStudentByDate(
      startDate,
      endDateFormatted
    ); 

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "cancelEventTeacher.hbs"
    );

    const dateNow = this.dateProvider.dateNow();

    events.forEach(async (event) => {
      const untilEventStart = this.dateProvider.differenceInHours(
        dateNow,
        event.start_date
      );

      if (untilEventStart < parameterRefundTimeLimitValue && Number(event.student_qty) > 0) {
        return
      }

      const eventData = await this.eventsRepository.findByIdToCreate(event.event_id);

      eventData.is_canceled = true;

      await this.eventsRepository.create(eventData);

      const { teacher_name, teacher_email, title, start_date, teacher_id } = event;
      const { end_date, instruction } = eventData;

      const sendMailWithLog = container.resolve(SendMailWithLog);

      const schedulesExists = await this.schedulesRepository.findByEventId(event.event_id);

      const dateFormatted = this.dateProvider.parseFormat(start_date, 'DD-MM-YYYY [às] HH:mm')

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
          await this._deleteSchedule(schedule.id, schedule.user.id)

          const { name, email, receive_email } = schedule.user;

          if (receive_email) {
            const mailMessage = `A aula "${title}" que teria início em ${dateFormatted} foi cancelada por não haver alunos suficientes. Os créditos foram devolvidos na sua conta!`

            const variables = {
              name,
              mailMessage,
            };

            const calendarEvent = {
              content: await createCalendarEvent({
                id: event.event_id,
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
                },
              }),
              method: 'CANCEL',
            }

            const subject = `Aula Cancelada - ${title}`

            sendMailWithLog.execute({
              to: email,
              subject,
              variables,
              path: templatePath,
              calendarEvent,
              mailLog: {
                userId: schedule.user.id
              },
            })
          }

          await this.statementsRepository.create({
            amount: eventData.credit,
            description: `Reembolso de aula cancelada. ${title} - ${day}`,
            type: OperationEnumTypeStatement.DEPOSIT,
            user_id: schedule.user_id,
          });

          const hours = await this.hoursRepository.findByUser(schedule.user_id);

          hours.amount = Number(hours.amount) + Number(eventData.credit);

          await this.hoursRepository.update(hours);
        });
      }

      const calendarEvent = {
        content: await createCalendarEvent({
          id: event.event_id,
          start: start_date,
          end: end_date,
          summary: title,
          description: instruction,
          location: 'Sala virtual',
          status: "CANCELLED",
          method: 'CANCEL',
          attendee: {
            name: teacher_name,
            email: teacher_email
          },
        }),
        method: 'CANCEL',
      }

      const mailMessage = `A aula "${title}" que teria início em ${dateFormatted} foi cancelada por não haver alunos suficientes.`

      const variables = {
        name: teacher_name,
        mailMessage,
      };

      const subject = `Aula cancelada - ${title}`

      await this.notificationsRepository.create({
        user_id: teacher_id,
        title: subject,
        path: templatePath,
        variables
      })

      sendMailWithLog.execute({
        to: teacher_email,
        subject,
        variables,
        path: templatePath,
        calendarEvent,
        mailLog: {
          userId: teacher_id
        },
        bcc: process.env.GENERAL_MAIL
      })
    })
  }
}

export { CancelEventWithoutStudentUseCase };
