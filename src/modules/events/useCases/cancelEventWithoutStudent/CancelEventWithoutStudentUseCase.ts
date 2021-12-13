
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
class CancelEventWithoutStudentUseCase {
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
    const studentlessPeriod = await this.parametersRepository.findByReference('StudentlessPeriod');

    const studentlessPeriodValue = Number(studentlessPeriod.value);

    const startDate = this.dateProvider.addHoursInDate(date, studentlessPeriodValue);
    const startDateFormated = this.dateProvider.parseFormat(startDate);

    const endDate = this.dateProvider.addHoursInDate(startDate, 1);
    const endDateFormated = this.dateProvider.parseFormat(endDate);

    const events = await this.eventsRepository.findEventWithoutStudentByDate(
      startDateFormated,
      endDateFormated
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

      const dateFormated = this.dateProvider.parseFormat(start_date)

      const mailMessage = `A aula "${title}" que teria início em ${dateFormated} foi cancelada por não haver alunos cadastrados.`

      const variables = {
        name: teacher_name,
        mailMessage,
      };

      this.mailProvider.sendMail(
        teacher_email,
        "Aula cancelada",
        variables,
        templatePath
      );
    })
  }
}

export { CancelEventWithoutStudentUseCase };
