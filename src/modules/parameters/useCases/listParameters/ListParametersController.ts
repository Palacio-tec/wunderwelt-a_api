import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListParametersUseCase } from "./ListParametersUseCase";

class ListParametersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listParametersUseCase = container.resolve(ListParametersUseCase);

    const parameters = await listParametersUseCase.execute();

    return response.status(201).json(parameters);
  }
}

export { ListParametersController };
