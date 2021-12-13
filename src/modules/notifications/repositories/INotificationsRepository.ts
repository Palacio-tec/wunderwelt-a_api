import { ICreateNotificationDTO } from "../dtos/ICreateNotificationsDTO";
import { Notification } from "../infra/typeorm/schemas/Notification";

interface INotificationsRepository {
  create(date: ICreateNotificationDTO): Promise<Notification>;
  updateToRead(id: string): Promise<void>;
  listRecentByUser(user_id: string): Promise<Notification[]>;
}

export { INotificationsRepository };
