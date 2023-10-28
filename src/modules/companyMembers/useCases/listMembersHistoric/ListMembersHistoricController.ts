import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListMembersHistoricUseCase } from "./ListMembersHistoricUseCase";

export class ListMembersHistoricController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { company_id: companyId } = request.query as { company_id: string };
    const { id: userId } = request.user;

    const listMembersHistoricUseCase = container.resolve(ListMembersHistoricUseCase);

    const balance = await listMembersHistoricUseCase.execute({ companyId, userId });

    return response.status(200).json(balance);
  }
}
