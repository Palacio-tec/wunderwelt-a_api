import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindEventUseCase } from "./FindEventUseCase";

class FindEventController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const findEventUseCase = container.resolve(FindEventUseCase);

    const event = await findEventUseCase.execute(id);

    return response.status(201).json(event);
  }
}

export { FindEventController };
