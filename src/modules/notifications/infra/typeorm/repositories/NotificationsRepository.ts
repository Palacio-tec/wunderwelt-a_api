import { getMongoRepository, MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";

import { ICreateNotificationDTO } from "@modules/notifications/dtos/ICreateNotificationsDTO";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";

import { Notification } from "../schemas/Notification";

class NotificationsRepository implements INotificationsRepository {
  private repository: MongoRepository<Notification>;

  constructor() {
    this.repository = getMongoRepository(
      Notification,
      process.env.NODE_ENV === "test" ? "mongo_test" : "mongo"
    );
  }

  async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.repository.create({
      content,
      recipient_id,
    });

    await this.repository.save(notification);

    return notification;
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

  async listRecentByUser(user_id: string): Promise<Notification[]> {
    const notifications = await this.repository.find({
      where: {
        recipient_id: user_id,
        read: false,
      },
    });

    return notifications;
  }
}

export { NotificationsRepository };
