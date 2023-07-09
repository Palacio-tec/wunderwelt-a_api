import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateCompanyMemberUseCase } from "./UpdateCompanyMemberUseCase";

class UpdateCompanyMemberController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { company_id, users } = request.body;

    const user_id = request.user.id;

    const updateCompanyMemberUseCase = container.resolve(UpdateCompanyMemberUseCase);

    await updateCompanyMemberUseCase.execute({ user_id, company_id, users });

    return response.status(200).send();
  }
}

export { UpdateCompanyMemberController };
