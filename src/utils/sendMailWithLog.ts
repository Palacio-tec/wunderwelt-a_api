
import { inject, injectable } from "tsyringe";

import { IMailProvider, IMailProviderProps } from "@shared/container/providers/MailProvider/IMailProvider";
import { IMailLogsRepository } from "@modules/mailLogs/repositories/IMailLogsRepository";

interface ISendMailWithLogProps extends IMailProviderProps {
    mailLog: {
        userId: string;
        content?: string;
    }
}

@injectable()
class SendMailWithLog {
  constructor(
    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("MailLogsRepository")
    private mailLogsRepository: IMailLogsRepository,
  ) {}

  async execute({
    to,
    subject,
    variables,
    path,
    calendarEvent,
    mailLog,
    bcc
  }: ISendMailWithLogProps): Promise<void> {
    try {
        await this.mailProvider.sendMail({
            to,
            subject,
            variables,
            path,
            calendarEvent,
            bcc
        })

        await this.mailLogsRepository.create({
            user_id: mailLog.userId,
            content: mailLog.content ? mailLog.content : subject,
        });
    } catch (err) {
        await this.mailLogsRepository.create({
            error: true,
            message: err,
            user_id: mailLog.userId,
            content: mailLog.content ? mailLog.content : subject,
        });
    }
  }
}

export { SendMailWithLog };
