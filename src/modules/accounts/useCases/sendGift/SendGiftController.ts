import { container } from "tsyringe";
import { Request, Response } from "express";

import { SendGiftUseCase } from "./SendGiftUseCase";

class SendGiftController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      credit,
      users
    } = request.body;

    const admin_id = request.user.id;

    const sendGiftUseCase = container.resolve(SendGiftUseCase);

    await sendGiftUseCase.execute({ credit, users, admin_id });

    return response.status(201).send();
  }
}

export { SendGiftController };
