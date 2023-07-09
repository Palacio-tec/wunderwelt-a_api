import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteCompanyMemberUseCase } from "./DeleteCompanyMemberUseCase";

class DeleteCompanyMemberController {
  async handle(request: Request, response: Response): Promise<Response> {
    const company_id = String(request.params.company_id);

    const user_id = request.user.id;

    const deleteCompanyMemberUseCase = container.resolve(DeleteCompanyMemberUseCase);

    await deleteCompanyMemberUseCase.execute({ user_id, company_id });

    return response.status(200).send();
  }
}

export { DeleteCompanyMemberController };
