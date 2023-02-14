import { ICreateNotificationDTO } from "../dtos/ICreateNotificationDTO";
import { Notifications } from "../infra/typeorm/schemas/Notification";

interface INotificationsRepository {
  create(notification: ICreateNotificationDTO): Promise<Notifications>;
  listRecentByUser(user_id: string): Promise<Notifications[]>;
}

export { INotificationsRepository };