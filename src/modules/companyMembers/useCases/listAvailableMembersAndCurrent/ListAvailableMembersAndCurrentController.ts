import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAvailableMembersAndCurrentUseCase } from "./ListAvailableMembersAndCurrentUseCase";

class ListAvailableMembersAndCurrentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const company_id = String(request.params.company_id);
    const user_id = request.user.id;

    const listAvailableMembersAndCurrentUseCase = container.resolve(ListAvailableMembersAndCurrentUseCase);

    const companyMembersHistoric = await listAvailableMembersAndCurrentUseCase.execute({
      company_id,
      user_id,
    });

    return response.status(200).json(companyMembersHistoric);
  }
}

export { ListAvailableMembersAndCurrentController };
