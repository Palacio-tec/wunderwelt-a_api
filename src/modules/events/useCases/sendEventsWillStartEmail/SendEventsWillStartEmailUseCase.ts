
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
    const startDateFormated = this.dateProvider.parseFormat(date);
    const endDate = this.dateProvider.addHours(1);
    const endDateFormated = this.dateProvider.parseFormat(endDate);

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
        `Lista de alunos - ${title}`,
        variables,
        templatePath
      );
    })
  }
}

export { SendEventsWillStartEmailUseCase };
