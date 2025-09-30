import { Request, Response } from "express";
import { container } from "tsyringe";

import { FindTemplateUseCase } from "./FindTemplateUseCase";

class FindTemplateController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const findTemplateUseCase = container.resolve(FindTemplateUseCase);

    const template = await findTemplateUseCase.execute(id);

    return response.status(201).json(template);
  }
}

export { FindTemplateController };
