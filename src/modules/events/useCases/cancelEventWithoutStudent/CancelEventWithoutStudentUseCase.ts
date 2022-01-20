import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";

@injectable()
class CancelEventWithoutStudentUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

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
  ) {}

  async execute(date: Date): Promise<void> {
    const studentlessPeriod = await this.parametersRepository.findByReference('StudentlessPeriod');

    const studentlessPeriodValue = Number(studentlessPeriod.value);

    const startDate = this.dateProvider.addHoursInDate(date, studentlessPeriodValue);
    const startDateFormated = this.dateProvider.parseISO(startDate).toISOString();

    // console.log( `[EventsWithoutStudent - ${date}] startDate = '${startDateFormated}'` )

    const events = await this.eventsRepository.findEventWithoutStudentByDate(
      startDateFormated
    ); 

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "cancelEvent.hbs"
    );

    events.map(async (event) => {
      const eventData = await this.eventsRepository.findByIdToCreate(event.event_id);

      eventData.is_canceled = true;

      await this.eventsRepository.create(eventData);

      const { teacher_name, teacher_email, title, start_date } = event;

      const dateFormated = this.dateProvider.parseFormat(start_date, 'DD-MM-YYYY [às] HH:mm')

      const mailMessage = `A aula "${title}" que teria início em ${dateFormated} foi cancelada por não haver alunos suficientes.`

      const variables = {
        name: teacher_name,
        mailMessage,
      };

      this.mailProvider.sendMail(
        teacher_email,
        `Aula cancelada - ${title}`,
        variables,
        templatePath
      );

      const schedulesExists = await this.schedulesRepository.findByEventId(event.event_id);

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
          const mailMessage = `Infelizmente a aula "${title}" foi cancelada por não atingir a quantidade mínima de alunos. Não se preocupe que os seus créditos foram reembolsados.`

          const variables = {
            name,
            mailMessage,
          };

          await this.mailProvider.sendMail(
            email,
            `Aula Cancelada - ${title}`,
            variables,
            templatePath
          );

          await this.statementsRepository.create({
            amount: eventData.credit,
            description: `Reembolso de aula cancelada. ${title} - ${day}`,
            type: OperationEnumTypeStatement.DEPOSIT,
            user_id: schedule.user_id,
          });

          const hours = await this.hoursRepository.findByUser(schedule.user_id);

          hours.amount = Number(hours.amount) + eventData.credit;

          await this.hoursRepository.update(hours);
        });
      }
    })
  }
}

export { CancelEventWithoutStudentUseCase };
