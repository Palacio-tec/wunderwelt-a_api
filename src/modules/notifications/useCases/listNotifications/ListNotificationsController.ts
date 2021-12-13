import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListNotificationsUseCase } from "./ListNotificationsUseCase";

class ListNotificationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const listNotificationsUseCase = container.resolve(
      ListNotificationsUseCase
    );

    const notifications = await listNotificationsUseCase.execute({
      user_id: id,
    });

    return response.status(201).json(notifications);
  }
}

export { ListNotificationsController };
