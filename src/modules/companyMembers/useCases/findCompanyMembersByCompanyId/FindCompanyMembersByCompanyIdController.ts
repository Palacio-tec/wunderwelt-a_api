import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindCompanyMembersByCompanyIdUseCase } from "./FindCompanyMembersByCompanyIdUseCase";

class FindCompanyMembersByCompanyIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const company_id = String(request.params.company_id);
    const user_id = request.user.id;

    const findCompanyMembersByCompanyIdUseCase = container.resolve(FindCompanyMembersByCompanyIdUseCase);

    const companyMembers = await findCompanyMembersByCompanyIdUseCase.execute({company_id, user_id});

    return response.status(200).json(companyMembers);
  }
}

export { FindCompanyMembersByCompanyIdController };
