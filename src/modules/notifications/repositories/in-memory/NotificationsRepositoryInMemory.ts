import { ObjectId } from "mongodb";

import { ICreateNotificationDTO } from "@modules/notifications/dtos/ICreateNotificationsDTO";
import { Notification } from "@modules/notifications/infra/typeorm/schemas/Notification";
import { AppError } from "@shared/errors/AppError";

import { INotificationsRepository } from "../INotificationsRepository";

class NotificationsRepositoryInMemory implements INotificationsRepository {
  notifications: Notification[] = [];

  async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, {
      id: new ObjectId(),
      content,
      recipient_id,
    });

    this.notifications.push(notification);

    return notification;
  }

  async updateToRead(id: string): Promise<void> {
    const notificationIndex = this.notifications.findIndex(
      (notification) => notification.id.toString() === id
    );

    if (!notificationIndex) {
      throw new AppError("Notification not found");
    }

    this.notifications[notificationIndex].read = true;
  }
}

export { NotificationsRepositoryInMemory };
