import { Request, Response } from "express";
import { container } from "tsyringe";
import { ClassSubjectFieldsUseCase } from "./ClassSubjectFieldsUseCase";

class ClassSubjectFieldsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const field = String(request.query.field);
    const value = String(request.query.value);
    const class_subject_id = request.query.class_subject_id;

    const classSubjectFieldsUseCase = container.resolve(ClassSubjectFieldsUseCase);

    const classSubjectExists = await classSubjectFieldsUseCase.execute(field, value, class_subject_id as string);

    return response.status(201).json(classSubjectExists);
  }
}

export { ClassSubjectFieldsController };
