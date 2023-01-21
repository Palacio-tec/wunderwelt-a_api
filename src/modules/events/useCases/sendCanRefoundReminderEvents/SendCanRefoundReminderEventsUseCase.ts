
import { container, inject, injectable } from "tsyringe";
import { format } from "date-fns";
import { resolve } from "path";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { SendMailWithLog } from "@utils/sendMailWithLog";

@injectable()
class SendCanRefoundReminderEventsUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,
  ) {}

  async execute(date: Date): Promise<void> {
    const refundPeriodReminder = await this.parametersRepository.findByReference('RefundPeriodReminder');
    const refundTimeLimit = await this.parametersRepository.findByReference('RefundTimeLimit');

    const refundPeriodReminderValue = Number(refundPeriodReminder.value);

    const startDate = this.dateProvider.addDaysInDate(date, refundPeriodReminderValue);
    const startDateFormated = this.dateProvider.parseFormatUTC(startDate);

    const endDate = this.dateProvider.addHoursInDate(startDate, 1);
    const endDateFormated = this.dateProvider.parseFormatUTC(endDate);

    const events = await this.eventsRepository.findEventWillStart(
      startDateFormated,
      endDateFormated
    ); 

    const sendMailWithLog = container.resolve(SendMailWithLog);

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "refoundReminder.hbs"
    );

    events.map(async (event) => {
      const schedules = await this.schedulesRepository.findByEventId(event.event_id);
      
      const { title } = event;

      schedules.map(async (schedule) => {
        const { user } = schedule;
        const eventDate = this.dateProvider.parseFormat(event.start_date, "DD-MM-YYYY [às] HH:mm")

        const variables = {
          name: user.name,
          title,
          eventDate,
          refundTimeLimit: refundTimeLimit.value,
        };

        sendMailWithLog.execute({
          to: user.email,
          subject: "Deseja manter ou cancelar sua próxima aula?",
          variables,
          path: templatePath,
          mailLog: {
            userId: user.id
          },
        })
      })
    })
  }
}

export { SendCanRefoundReminderEventsUseCase };
