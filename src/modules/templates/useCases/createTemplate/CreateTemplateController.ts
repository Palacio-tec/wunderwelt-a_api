import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateTemplateUseCase } from "./CreateTemplateUseCase";

class CreateTemplateController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { title, body, template } = request.body;
    const { id: user_id } = request.user;

    const createTemplateUseCase = container.resolve(CreateTemplateUseCase);

    const templateCreated = await createTemplateUseCase.execute({
      title,
      body,
      template,
      user_id,
    });

    return response.status(201).json(templateCreated);
  }
}

export { CreateTemplateController };
