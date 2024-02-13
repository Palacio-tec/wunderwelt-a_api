import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindClassSubjectUseCase } from "./FindClassSubjectUseCase";

class FindClassSubjectController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const findClassSubjectUseCase = container.resolve(FindClassSubjectUseCase);

    const classSubject = await findClassSubjectUseCase.execute(id);

    return response.status(201).json(classSubject);
  }
}

export { FindClassSubjectController };
