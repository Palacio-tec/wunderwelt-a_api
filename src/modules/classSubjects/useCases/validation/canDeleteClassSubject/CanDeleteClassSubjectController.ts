import { Request, Response } from "express";
import { container } from "tsyringe";
import { CanDeleteClassSubjectUseCase } from "./CanDeleteClassSubjectUseCase";

class CanDeleteClassSubjectController {
  async handle(request: Request, response: Response): Promise<Response> {
    const class_subject_id = String(request.query.class_subject_id);

    const canDeleteClassSubjectUseCase = container.resolve(CanDeleteClassSubjectUseCase);

    const validation = await canDeleteClassSubjectUseCase.execute(class_subject_id);

    return response.status(201).json(validation);
  }
}

export { CanDeleteClassSubjectController };
