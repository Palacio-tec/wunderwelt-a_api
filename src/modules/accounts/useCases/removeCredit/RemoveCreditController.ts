import { container } from "tsyringe";
import { Request, Response } from "express";

import { RemoveCreditUseCase } from "./RemoveCreditUseCase";

class RemoveCreditController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      credit,
      users
    } = request.body;

    const admin_id = request.user.id;

    const removeCreditUseCase = container.resolve(RemoveCreditUseCase);

    await removeCreditUseCase.execute({ credit, users, admin_id });

    return response.status(201).send();
  }
}

export { RemoveCreditController };
