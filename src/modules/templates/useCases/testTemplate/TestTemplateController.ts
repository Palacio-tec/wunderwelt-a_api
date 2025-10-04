import { Request, Response } from "express";
import { container } from "tsyringe";

import { TestTemplateUseCase } from "./TestTemplateUseCase";

class TestTemplateController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { template, layout, variables } = request.body;
    const { id: user_id } = request.user;

    const testTemplateUseCase = container.resolve(TestTemplateUseCase);

    const emailSent = await testTemplateUseCase.execute({
      templateName: template,
      base: layout,
      variables,
      user_id
    });

    return response.status(201).json(emailSent);
  }
}

export { TestTemplateController };
