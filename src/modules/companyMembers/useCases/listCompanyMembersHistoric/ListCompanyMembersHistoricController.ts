import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListCompanyMembersHistoricUseCase } from "./ListCompanyMembersHistoricUseCase";

class ListCompanyMembersHistoricController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { users } = request.body;
    const company_id = request.user.id;

    const listCompanyMembersHistoricUseCase = container.resolve(ListCompanyMembersHistoricUseCase);

    const companyMembersHistoric = await listCompanyMembersHistoricUseCase.execute({company_id, users});

    return response.status(200).json(companyMembersHistoric);
  }
}

export { ListCompanyMembersHistoricController };
