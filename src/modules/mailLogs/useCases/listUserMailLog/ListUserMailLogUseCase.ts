import { inject, injectable } from "tsyringe";

import { MailLog } from "@modules/mailLogs/infra/typeorm/schemas/MailLog";
import { IMailLogsRepository } from "@modules/mailLogs/repositories/IMailLogsRepository";

@injectable()
class ListUserMailLogUseCase {
  constructor(
    @inject("MailLogsRepository")
    private readonly mailLogsRepository: IMailLogsRepository
  ) {}

  async execute({ user_id }): Promise<MailLog[]> {
    const mailLogs = await this.mailLogsRepository.listRecentByUser(
      user_id
    );

    return mailLogs;
  }
}

export { ListUserMailLogUseCase };
