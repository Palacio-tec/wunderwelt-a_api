import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateClassSubjectUseCase } from "./CreateClassSubjectUseCase";

class CreateClassSubjectController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { subject, quantity } = request.body;
    const user_id = request.user.id;

    const createClassSubjectUseCase = container.resolve(CreateClassSubjectUseCase);

    const ClassSubject = await createClassSubjectUseCase.execute({
        subject, quantity
    }, user_id);

    return response.status(201).json(ClassSubject);
  }
}

export { CreateClassSubjectController };
