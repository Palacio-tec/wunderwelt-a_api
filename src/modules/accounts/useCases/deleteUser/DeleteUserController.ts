import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteUserUseCase } from "./DeleteUserUseCase";

class DeleteUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const user_id = request.user.id;

    const deleteUserUseCase = container.resolve(DeleteUserUseCase);

    await deleteUserUseCase.execute(id, user_id);

    return response.status(201).send();
  }
}

export { DeleteUserController };
