import { getMongoRepository, MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import fs from "fs";
import handlebars from "handlebars";

import { ICreateNotificationDTO } from "@modules/notifications/dtos/ICreateNotificationDTO";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";

import { Notifications } from "../schemas/Notification";

class NotificationsRepository implements INotificationsRepository {
    private repository: MongoRepository<Notifications>;

    constructor() {
        this.repository = getMongoRepository(
            Notifications,
            process.env.NODE_ENV === "test" ? "mongo_test" : "mongo"
        );
    }

    async create({
        user_id,
        title,
        path,
        variables
    }: ICreateNotificationDTO): Promise<Notifications> {
        const templateFileContent = fs.readFileSync(path).toString("utf-8");
        const templateParse = handlebars.compile(templateFileContent);
        const templateHTML = templateParse(variables);

        const notification = this.repository.create({
            user_id,
            title,
            content: templateHTML
        });

        await this.repository.save(notification);

        return notification;
    }

    async listRecentByUser(user_id: string): Promise<Notifications[]> {
        const notifications = await this.repository.find({
            where: {
                user_id: user_id,
            },
            order: {
                created_at: "DESC"
            },
            take: 20,
        });

        return notifications;
    }

    async updateToRead(id: string): Promise<void> {
        const objectId = new ObjectId(id);
    
        await this.repository.findOneAndUpdate(
            { _id: objectId },
            {
            $set: {
                read: true,
            },
            }
        );
    }

    async findById(id: string): Promise<Notifications> {
        const objectId = new ObjectId(id)

        const notification = await this.repository.findOne({ _id: objectId })

        return notification
    }

    async updateAllToRead(user_id: string): Promise<void> {
        const notifications = await this.repository.updateMany(
            { user_id },
            {
                $set: {
                    read: true,
                },
            }
        );

        return
    }
}

export { NotificationsRepository };
