import { inject, injectable } from "tsyringe";

import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";

@injectable()
class UpdateNotificationUseCase {
  constructor(
    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this.notificationsRepository.updateToRead(id);
  }
}

export { UpdateNotificationUseCase };
