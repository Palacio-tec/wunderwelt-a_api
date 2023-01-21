import { ICreateMailLogDTO } from "../dtos/ICreateMailLogDTO";
import { MailLog } from "../infra/typeorm/schemas/MailLog";

interface IMailLogsRepository {
  create(date: ICreateMailLogDTO): Promise<MailLog>;
  listRecentByUser(user_id: string): Promise<MailLog[]>;
}

export { IMailLogsRepository };