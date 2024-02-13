import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import { ListClassSubjectsUseCase } from "./ListClassSubjectsUseCase";

class ListClassSubjectsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listClassSubjectSsUseCase = container.resolve(ListClassSubjectsUseCase);

    const classSubjects = await listClassSubjectSsUseCase.execute();

    return response.status(201).json(classToClass(classSubjects));
  }
}

export { ListClassSubjectsController };
