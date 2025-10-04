import { inject, injectable } from "tsyringe";

import { ICreateQueueDTO } from "@modules/queues/dtos/ICreateQueueDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { Queue } from "@modules/queues/infra/typeorm/entities/Queue";
import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

@injectable()
class CreateQueueUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository
  ) {}

  private async __sendMailWithSuggestion(
    student: string,
    title: string,
    suggestion: string,
    day: string,
    start_hour: string
  ) {
    const templates = await this.templatesRepository.findTemplateAndBase(
      "mail_with_suggestion"
    );

    const variables = {
      student,
      title,
      suggestion,
      day,
      start_hour,
    };

    this.mailProvider.sendMail({
      to: process.env.GENERAL_MAIL,
      subject: "Sugestão de aluno para aula",
      variables,
      template: templates.get("mail_with_suggestion").body,
      base: templates.get("base").body,
    });
  }

  async execute({
    event_id,
    user_id,
    sugestion,
  }: ICreateQueueDTO): Promise<Queue> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    const eventExists = await this.eventsRepository.findById(event_id);

    if (!eventExists) {
      throw new AppError("Event does not exists");
    }

    const queue = await this.queuesRepository.create({
      event_id,
      user_id,
      sugestion,
    });

    if (sugestion) {
      const { start_date, title } = eventExists;
      const day = this.dateProvider.formatInDate(start_date);
      const start_hour = this.dateProvider.formatInHour(start_date);

      await this.__sendMailWithSuggestion(
        userExists.name,
        title,
        sugestion,
        day,
        start_hour
      );
    }

    return queue;
  }
}

export { CreateQueueUseCase };
