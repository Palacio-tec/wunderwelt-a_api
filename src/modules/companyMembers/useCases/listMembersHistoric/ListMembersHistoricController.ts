import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListMembersHistoricUseCase } from "./ListMembersHistoricUseCase";

export class ListMembersHistoricController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.query as { name: string };
    const { id: userId } = request.user;

    const listMembersHistoricUseCase = container.resolve(ListMembersHistoricUseCase);

    const balance = await listMembersHistoricUseCase.execute({ name, userId });

    return response.status(200).json(balance);
  }
}
