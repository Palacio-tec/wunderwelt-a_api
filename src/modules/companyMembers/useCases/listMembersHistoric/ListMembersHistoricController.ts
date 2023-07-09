import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListMembersHistoricUseCase } from "./ListMembersHistoricUseCase";

export class ListMembersHistoricController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { member_id } = request.query as { member_id: string };
    const { id: user_id } = request.user;

    const listMembersHistoricUseCase = container.resolve(ListMembersHistoricUseCase);

    const balance = await listMembersHistoricUseCase.execute({
      user_id,
      member_id
    });

    return response.status(200).json(balance);
  }
}
