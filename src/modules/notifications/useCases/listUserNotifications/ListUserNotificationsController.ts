import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListUserNotificationsUseCase } from "./ListUserNotificationsUseCase";

class ListUserNotificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const listUserNotificationsUseCase = container.resolve(
        ListUserNotificationsUseCase
    );

    const notifications = await listUserNotificationsUseCase.execute({
      user_id: id,
    });

    return response.status(201).json(notifications);
  }
}

export { ListUserNotificationController };