import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindFQAUseCase } from "./FindFQAUseCase";

class FindFQAController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const findFQAUseCase = container.resolve(FindFQAUseCase);

    const fqa = await findFQAUseCase.execute(id);

    return response.status(201).json(fqa);
  }
}

export { FindFQAController };
