
import { inject, injectable } from "tsyringe";
import { format } from "date-fns";
import { resolve } from "path";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { EventsRepository } from "@modules/events/infra/typeorm/repositories/EventsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

@injectable()
class SendEventsWillStartEmailUseCase {
  constructor(
    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("DateProvider")
    private dateProvider: IDateProvider,
  ) {}

  async execute(date: Date): Promise<void> {
    const startDate = this.dateProvider.addHoursInDate(date, 1);
    const startDateFormatted = this.dateProvider.parseFormat(startDate);
    const endDate = this.dateProvider.addHoursInDate(date, 2);
    const endDateFormatted = this.dateProvider.parseFormat(endDate);

    console.log( `[EventsWillStart - ${date}] startDate = '${startDateFormatted}' - endDate ='${endDateFormatted}'` )

    const events = await this.eventsRepository.findEventWillStart(
      startDateFormatted,
      endDateFormatted
    ); 

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "eventWillStart.hbs"
    );

    events.map(async (event) => {
      const schedules = await this.schedulesRepository.findByEventId(event.event_id);

      const { teacher_name, teacher_email, title, start_date, link } = event;

      const time = this.dateProvider.formatInHour(start_date)

      const variables = {
        name: teacher_name,
        title,
        time,
        schedules,
        link,
      };

      this.mailProvider.sendMail(
        teacher_email,
        'Lista de alunos inscritos na aula',
        variables,
        templatePath
      );
    })
  }
}

export { SendEventsWillStartEmailUseCase };
