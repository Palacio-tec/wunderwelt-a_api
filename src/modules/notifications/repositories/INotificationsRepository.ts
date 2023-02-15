import { ICreateNotificationDTO } from "../dtos/ICreateNotificationDTO";
import { Notifications } from "../infra/typeorm/schemas/Notification";

interface INotificationsRepository {
  create(notification: ICreateNotificationDTO): Promise<Notifications>;
  listRecentByUser(user_id: string): Promise<Notifications[]>;
  updateToRead(id: string): Promise<void>;
}

export { INotificationsRepository };