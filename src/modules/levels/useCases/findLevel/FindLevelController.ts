import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindLevelUseCase } from "./FIndLevelUseCase";

class FindLevelController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const findLevelUseCase = container.resolve(FindLevelUseCase);

    const level = await findLevelUseCase.execute(id);

    return response.status(201).json(level);
  }
}

export { FindLevelController };
