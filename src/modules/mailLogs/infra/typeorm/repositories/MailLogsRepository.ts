import { getMongoRepository, MongoRepository } from "typeorm";

import { ICreateMailLogDTO } from "@modules/mailLogs/dtos/ICreateMailLogDTO";
import { IMailLogsRepository } from "@modules/mailLogs/repositories/IMailLogsRepository";

import { MailLog } from "../schemas/MailLog";

class MailLogsRepository implements IMailLogsRepository {
    private repository: MongoRepository<MailLog>;

    constructor() {
        this.repository = getMongoRepository(
            MailLog,
            process.env.NODE_ENV === "test" ? "mongo_test" : "mongo"
        );
    }

    async create({
        content,
        user_id,
        error,
        message,
    }: ICreateMailLogDTO): Promise<MailLog> {
        const mailLog = this.repository.create({
            content,
            user_id,
            error,
            message
        });

        await this.repository.save(mailLog);

        return mailLog;
    }

    async listRecentByUser(user_id: string): Promise<MailLog[]> {
        const mailLogs = await this.repository.find({
            where: {
                user_id: user_id,
            },
            order: {
                created_at: "DESC"
            },
            take: 20,
        });

        return mailLogs;
    }
}

export { MailLogsRepository };
