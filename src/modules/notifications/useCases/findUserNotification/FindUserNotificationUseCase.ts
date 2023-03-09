import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { Notifications } from "@modules/notifications/infra/typeorm/schemas/Notification";

@injectable()
class FindUserNotificationUseCase {
  constructor(
    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository,
  ) {}

  async execute(id: string): Promise<Notifications> {
    const notification = await this.notificationsRepository.findById(id);

    if (!notification) {
      throw new AppError("Notification does not exists");
    }

    return notification
  }
}

export { FindUserNotificationUseCase };
