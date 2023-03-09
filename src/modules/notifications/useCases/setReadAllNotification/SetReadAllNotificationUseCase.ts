import { inject, injectable } from "tsyringe";

import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";

@injectable()
class SetReadAllNotificationUseCase {
  constructor(
    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this.notificationsRepository.updateAllToRead(id);
  }
}

export { SetReadAllNotificationUseCase };
