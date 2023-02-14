import { inject, injectable } from "tsyringe";

import { Notifications } from "@modules/notifications/infra/typeorm/schemas/Notification";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";

@injectable()
class ListUserNotificationsUseCase {
  constructor(
    @inject("NotificationsRepository")
    private readonly notificationsRepository: INotificationsRepository
  ) {}

  async execute({ user_id }): Promise<Notifications[]> {
    const notifications = await this.notificationsRepository.listRecentByUser(
      user_id
    );

    return notifications;
  }
}

export { ListUserNotificationsUseCase };
