import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateClassSubjectUseCase } from "./UpdateClassSubjectUseCase";

class UpdateClassSubjectController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const {
      subject,
      quantity
    } = request.body;
    const user_id = request.user.id;

    const updateClassSubjectUseCase = container.resolve(UpdateClassSubjectUseCase);

    const classSubject = await updateClassSubjectUseCase.execute(
      {
        id,
        subject,
        quantity,
      },
      user_id
    );

    return response.status(201).json(classSubject);
  }
}

export { UpdateClassSubjectController };
