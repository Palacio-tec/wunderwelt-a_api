import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListUserEventsWaitingListUseCase } from "./ListUserEventsWaitingListUseCase";

class ListUserEventsWaitingListController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const listUserEventsWaitingListUseCase = container.resolve(
        ListUserEventsWaitingListUseCase
    );

    const events = await listUserEventsWaitingListUseCase.execute({
      user_id,
    });

    return response.status(201).json(events);
  }
}

export { ListUserEventsWaitingListController };
