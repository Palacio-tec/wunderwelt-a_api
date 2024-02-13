import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteClassSubjectUseCase } from "./DeleteClassSubjectUseCase";

class DeleteClassSubjectController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const user_id = request.user.id;

    const deleteClassSubjectUseCase = container.resolve(DeleteClassSubjectUseCase);

    await deleteClassSubjectUseCase.execute(id, user_id);

    return response.status(201).send();
  }
}

export { DeleteClassSubjectController };
