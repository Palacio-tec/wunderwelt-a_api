import { container, inject, injectable } from "tsyringe";
import { resolve } from "path";
import { format } from "date-fns";

import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ICreateScheduleDTO } from "@modules/schedules/dtos/ICreateScheduleDTO";
import { Schedule } from "@modules/schedules/infra/typeorm/entities/Schedule";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";
import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";
import { createCalendarEvent } from "@utils/createCalendarEvent";
import { ISchedulesCreditsRepository } from "@modules/schedules/repositories/ISchedulesCreditsRepository";
import { SendMailWithLog } from "@utils/sendMailWithLog";

type ICreditUsedProps = {
  id: string;
  amount: number;
}
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

    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository,

    @inject("SchedulesCreditsRepository")
    private schedulesCreditsRepository: ISchedulesCreditsRepository,
  ) {}

  async createCreditUsedHistoric(creditList: ICreditUsedProps[], schedule_id: string) {
    creditList.map(credit => {
      this.schedulesCreditsRepository.create({
        schedule_id,
        credit_id: credit.id,
        amount_credit: credit.amount
      })
    })
  }

  private async _debitCredit(user_id: string, total_amount: number, schedule_id: string) {
    if (total_amount <= 0) {
      return
    }

    const creditsList = await this.hoursRepository.listAvailableByUser(user_id)
    const creditIds: ICreditUsedProps[] = []

    let remainingAmount = total_amount

    for (let index = 0; index < creditsList.length; index++) {
      const credit = creditsList[index];

      let newBalance = (Number(credit.balance) - remainingAmount)
      let amountUsed = remainingAmount

      if (remainingAmount >= Number(credit.balance)) {
        newBalance = 0
        amountUsed = Number(credit.balance)
      }

      this.hoursRepository.update({
        ...credit,
        balance: newBalance
      })

      creditIds.push({id: credit.id, amount: amountUsed})

      remainingAmount -= Number(credit.balance)

      if (remainingAmount <= 0) {
        break
      }
    }

    this.createCreditUsedHistoric(creditIds, schedule_id)
  }

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

    const { start_date, end_date, title, instruction, credit } = eventExists;

    if (Number(userExists.credit) < Number(credit)) {
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

    this._debitCredit(user_id, Number(credit), schedule.id)

    const day = this.dateProvider.formatInDate(start_date);
    const start_hour = this.dateProvider.formatInHour(start_date);

    await this.statementsRepository.create({
      amount: credit,
      description: `Inscrição na aula ${eventExists.title} - ${day}`,
      type: OperationEnumTypeStatement.WITHDRAW,
      user_id,
    });

    this.usersRepository.create({
      ...userExists,
      credit: Number(userExists.credit) - Number(credit)
    })

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "createSchedule.hbs"
    );

    const sendMailWithLog = container.resolve(SendMailWithLog);

    const { name, email } = userExists;

    const instructionInfo = instruction.split(/\r?\n/)

    let instructionHTML = ''

    instructionInfo.forEach(info => {
      if (info.includes('http')) {
        instructionHTML += `<br /><a href='${info}'>${info}</a>`
      } else {
        instructionHTML += `<br /><text>${info}</text>`
      }
    });

    const variables = {
      name,
      title,
      day,
      start_hour,
      hasInstruction: !!instruction,
      instruction: instructionHTML,
    };

    const calendarEvent = {
      content: await createCalendarEvent({
        id: event_id,
        start: start_date,
        end: end_date,
        summary: title,
        description: instruction,
        location: 'Sala virtual',
        status: "CONFIRMED",
        method: 'REQUEST',
        attendee: {
          name,
          email
        },
      }),
      method: 'REQUEST',
    }

    sendMailWithLog.execute({
      to: email,
      subject: "Inscrição na aula realizada com sucesso!",
      variables,
      path: templatePath,
      calendarEvent,
      mailLog: {
        userId: user_id
      },
    })

    return schedule;
  }
}

export { CreateScheduleUseCase };
