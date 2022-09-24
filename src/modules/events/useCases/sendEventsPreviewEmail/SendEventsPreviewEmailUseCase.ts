
import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";

@injectable()
class SendEventsPreviewEmailUseCase {
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
    const reminderEventEmail = await this.parametersRepository.findByReference('PreviewEventEmail');

    const reminderEventEmailValue = Number(reminderEventEmail.value)

    const startDate = this.dateProvider.addHoursInDate(date, reminderEventEmailValue);
    const startDateFormatted = this.dateProvider.parseFormatUTC(startDate);
    
    const endDate = this.dateProvider.addMinutesInDate(startDate, 59);
    const endDateFormatted = this.dateProvider.parseFormatUTC(endDate);

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
      "eventPreview.hbs"
    );

    events.map(async (event) => {
      const schedules = await this.schedulesRepository.findByEventId(event.event_id);

      const { teacher_name, teacher_email, title, start_date, link } = event;

      const datetime = this.dateProvider.parseFormat(start_date, "DD-MM-YYYY [às] HH:mm")

      const subject = `Prévia da Lista de alunos inscritos na aula - ${title} ${datetime}`

      const variables = {
        name: teacher_name,
        title,
        datetime,
        schedules,
      };

      this.mailProvider.sendMail({
        to: teacher_email,
        subject,
        variables,
        path: templatePath
      });
    })
  }
}

export { SendEventsPreviewEmailUseCase };
