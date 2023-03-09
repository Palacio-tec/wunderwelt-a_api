import { Request, Response } from "express";
import { container } from "tsyringe";

import { FindUserNotificationUseCase } from "./FindUserNotificationUseCase";

class FindUserNotificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const findUserNotificationUseCase = container.resolve(FindUserNotificationUseCase);

    const notification = await findUserNotificationUseCase.execute(id);

    return response.status(200).json(notification);
  }
}

export { FindUserNotificationController };
