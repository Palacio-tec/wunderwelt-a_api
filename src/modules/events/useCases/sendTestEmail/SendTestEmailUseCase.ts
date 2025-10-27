import { inject, injectable } from "tsyringe";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { ITemplatesRepository } from "@modules/templates/repositories/ITemplatesRepository";

@injectable()
class SendTestEmailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("TemplatesRepository")
    private templatesRepository: ITemplatesRepository
  ) {}

  async execute({ userId, eventDate }): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError("User does not exists");
    }

    const events = await this.eventsRepository.findByUserIdAndDate(
      userId,
      eventDate
    );

    const eventReminderTemplate =
      await this.templatesRepository.findTemplateAndBase("event_reminder");
    const testeNoLinkTemplate =
      await this.templatesRepository.findTemplateAndBase("teste_no_link");
    const testeOnlyTextTemplate =
      await this.templatesRepository.findTemplateAndBase("teste_only_text");

    events.map(async (event) => {
      const schedules = await this.schedulesRepository.findByEventId(
        event.event_id
      );

      const { title, link } = event;

      const linkInfo = link.split(/\r?\n/);

      let newLink = "";

      linkInfo.forEach((info) => {
        if (info.includes("http")) {
          newLink += `<br /><a href='${info}'>${info}</a>`;
        } else {
          newLink += `<br /><text>${info}</text>`;
        }
      });

      schedules.map(async (schedule) => {
        const { user } = schedule;

        const variables = {
          name: user.name,
          title,
          link: newLink,
          time: 1,
        };

        this.mailProvider.sendMail({
          to: user.email,
          subject: eventReminderTemplate.get("event_reminder").subject,
          variables,
          template: eventReminderTemplate.get("event_reminder").body,
          base: eventReminderTemplate.get("base").body,
        });

        this.mailProvider.sendMail({
          to: user.email,
          subject: testeNoLinkTemplate.get("teste_no_link").subject,
          variables,
          template: testeNoLinkTemplate.get("teste_no_link").body,
          base: testeNoLinkTemplate.get("base").body,
        });

        this.mailProvider.sendMail({
          to: user.email,
          subject: testeOnlyTextTemplate.get("teste_only_text").subject,
          variables,
          template: testeOnlyTextTemplate.get("teste_only_text").body,
          base: testeOnlyTextTemplate.get("base").body,
        });
      });
    });
  }
}

export { SendTestEmailUseCase };
