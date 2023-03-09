import { Request, Response } from "express";
import { container } from "tsyringe";

import { SetReadAllNotificationUseCase } from "./SetReadAllNotificationUseCase";

class SetReadAllNotificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const setReadAllNotificationUseCase = container.resolve(
        SetReadAllNotificationUseCase
    );

    await setReadAllNotificationUseCase.execute(id);

    return response.status(200).send();
  }
}

export { SetReadAllNotificationController };
