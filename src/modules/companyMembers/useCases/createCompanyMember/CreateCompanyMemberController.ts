import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCompanyMemberUseCase } from "./CreateCompanyMemberUseCase";

class CreateCompanyMemberController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { company_id, users } = request.body;

    const user_id = request.user.id;

    const createCompanyMemberUseCase = container.resolve(CreateCompanyMemberUseCase);

    const companyMembers = await createCompanyMemberUseCase.execute({ user_id, company_id, users });

    return response.status(201).json(companyMembers);
  }
}

export { CreateCompanyMemberController };
