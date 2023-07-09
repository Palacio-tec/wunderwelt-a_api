import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindCompanyMembersByMyIdUseCase } from "./FindCompanyMembersByMyIdUseCase";

class FindCompanyMembersByMyIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const company_id = request.user.id;

    const findCompanyMembersByMyIdUseCase = container.resolve(FindCompanyMembersByMyIdUseCase);

    const companyMembers = await findCompanyMembersByMyIdUseCase.execute(company_id);

    return response.status(200).json(companyMembers);
  }
}

export { FindCompanyMembersByMyIdController };
