import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateNotificationUseCase } from "./UpdateNotificationUseCase";

class UpdateNotificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const updateNotificationUseCase = container.resolve(
      UpdateNotificationUseCase
    );

    await updateNotificationUseCase.execute(id);

    return response.status(201).send();
  }
}

export { UpdateNotificationController };
