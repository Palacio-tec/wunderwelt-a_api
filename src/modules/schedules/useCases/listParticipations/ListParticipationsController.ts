import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import { ListPaticipationsUseCase } from "./ListParticipationsUseCase";

class ListParticipationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listPaticipationsUseCase = container.resolve(ListPaticipationsUseCase);

    const participations = await listPaticipationsUseCase.execute();

    return response.status(202).json(classToClass(participations));
  }
}

export { ListParticipationsController };
