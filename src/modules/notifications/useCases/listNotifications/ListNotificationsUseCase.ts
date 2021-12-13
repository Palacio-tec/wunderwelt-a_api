import { inject, injectable } from "tsyringe";

import { Notification } from "@modules/notifications/infra/typeorm/schemas/Notification";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";

@injectable()
class ListNotificationsUseCase {
  constructor(
    @inject("NotificationsRepository")
    private readonly notificationsRepository: INotificationsRepository
  ) {}

  async execute({ user_id }): Promise<Notification[]> {
    const notifications = await this.notificationsRepository.listRecentByUser(
      user_id
    );

    return notifications;
  }
}

export { ListNotificationsUseCase };
