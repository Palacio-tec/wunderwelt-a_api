import { Request, Response } from "express";
import { container } from "tsyringe";

import { FindParameterUseCase } from "./FindParameterUseCase";

class FindParameterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id)

    const findParameterUseCase = container.resolve(FindParameterUseCase);

    const parameters = await findParameterUseCase.execute(id);

    return response.status(201).json(parameters);
  }
}

export { FindParameterController };
