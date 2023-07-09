import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListCompaniesUseCase } from "./ListCompaniesUseCase";

class ListCompaniesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listCompaniesUseCase = container.resolve(ListCompaniesUseCase);

    const companies = await listCompaniesUseCase.execute(user_id);

    return response.status(200).json(companies);
  }
}

export { ListCompaniesController };
