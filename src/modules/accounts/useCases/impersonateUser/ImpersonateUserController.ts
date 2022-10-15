import { Request, Response } from "express";
import { container } from "tsyringe";
import { ImpersonateUserUseCase } from "./ImpersonateUserUseCase";

class ImpersonateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.body;
    const admin_user = request.user.id;

    const impersonateUserUseCase = container.resolve(ImpersonateUserUseCase);

    const token = await impersonateUserUseCase.execute({ user_id, admin_user });

    return response.json(token);
  }
}

export { ImpersonateUserController };
