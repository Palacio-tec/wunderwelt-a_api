import { Request, Response } from "express";
import { container } from "tsyringe";

import { ConsultParameterUseCase } from "./ConsultParameterUseCase";

class ConsultParameterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const reference = String(request.params.reference)

    const consultParameterUseCase = container.resolve(ConsultParameterUseCase);

    const parameters = await consultParameterUseCase.execute(reference);

    return response.status(201).json(parameters);
  }
}

export { ConsultParameterController };
