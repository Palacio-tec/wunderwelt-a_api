import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListUserMailLogUseCase } from "./ListUserMailLogUseCase";

class ListUserMailLogController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const listUserMailLogUseCase = container.resolve(
        ListUserMailLogUseCase
    );

    const mailLogs = await listUserMailLogUseCase.execute({
      user_id: id,
    });

    return response.status(201).json(mailLogs);
  }
}

export { ListUserMailLogController };