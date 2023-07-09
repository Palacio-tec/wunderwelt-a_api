import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAvailableMembersUseCase } from "./ListAvailableMembersUseCase";

class ListAvailableMembersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listAvailableMembersUseCase = container.resolve(ListAvailableMembersUseCase);

    const companyMembersHistoric = await listAvailableMembersUseCase.execute(user_id);

    return response.status(200).json(companyMembersHistoric);
  }
}

export { ListAvailableMembersController };
