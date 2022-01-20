
import { inject, injectable } from "tsyringe";
import { format } from "date-fns";
import { resolve } from "path";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { EventsRepository } from "@modules/events/infra/typeorm/repositories/EventsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";

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

    const refundPeriodReminderValue = Number(refundPeriodReminder.value);

    const startDate = this.dateProvider.addDaysInDate(date, refundPeriodReminderValue);
    const startDateFormated = this.dateProvider.parseFormatUTC(startDate);

    const endDate = this.dateProvider.addHoursInDate(startDate, 1);
    const endDateFormated = this.dateProvider.parseFormatUTC(endDate);

    // console.log( `[EventsCanRefound - ${date}] startDate = '${startDateFormated}' - endDate ='${endDateFormated}'` )

    const events = await this.eventsRepository.findEventWillStart(
      startDateFormated,
      endDateFormated
    ); 

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

        const variables = {
          name: user.name,
          title,
        };
  
        this.mailProvider.sendMail(
          user.email,
          "Deseja cancelar a inscrição na aula?",
          variables,
          templatePath
        );
      })
    })
  }
}

export { SendCanRefoundReminderEventsUseCase };
