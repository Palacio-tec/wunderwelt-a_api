
import { inject, injectable } from "tsyringe";
import { resolve } from "path";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

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

    const templatePath = resolve(
        __dirname,
        "..",
        "..",
        "views",
        "emails",
        "eventReminder.hbs"
    );

    const templatePathNoLink = resolve(
        __dirname,
        "..",
        "..",
        "views",
        "emails",
        "testeNoLink.hbs"
    );

    const templateOnlyText = resolve(
        __dirname,
        "..",
        "..",
        "views",
        "emails",
        "testeOnlyText.hbs"
    );
  
    events.map(async (event) => {
        const schedules = await this.schedulesRepository.findByEventId(event.event_id);
        
        const { title, link } = event;

        const linkInfo = link.split(/\r?\n/)

        let newLink = ''

        linkInfo.forEach(info => {
            if (info.includes('http')) {
            newLink += `<br /><a href='${info}'>${info}</a>`
            } else {
            newLink += `<br /><text>${info}</text>`
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
                subject: "[TESTE] A sua aula vai começar daqui a pouco!",
                variables,
                path: templatePath
            });

            this.mailProvider.sendMail({
                to: user.email,
                subject: "[TESTE][SEM-LINK] A sua aula vai começar daqui a pouco!",
                variables,
                path: templatePathNoLink
            });

            this.mailProvider.sendMail({
                to: user.email,
                subject: "[TESTE][SOMENTE-TEXTO] A sua aula vai começar daqui a pouco!",
                variables,
                path: templateOnlyText
            });
        })
    })
  }
}

export { SendTestEmailUseCase };
