import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindCompanyMembersByCompanyIdAndAvailableUseCase } from "./FindCompanyMembersByCompanyIdAndAvailableUseCase";

class FindCompanyMembersByCompanyIdAndAvailableController {
  async handle(request: Request, response: Response): Promise<Response> {
    const company_id = String(request.params.company_id);
    const user_id = request.user.id;

    const findCompanyMembersByCompanyIdAndAvailableUseCase = container.resolve(FindCompanyMembersByCompanyIdAndAvailableUseCase);

    const companyMembers = await findCompanyMembersByCompanyIdAndAvailableUseCase.execute({company_id, user_id});

    return response.status(200).json(companyMembers);
  }
}

export { FindCompanyMembersByCompanyIdAndAvailableController };
