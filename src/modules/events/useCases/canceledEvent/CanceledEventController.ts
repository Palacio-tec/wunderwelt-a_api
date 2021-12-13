import { Request, Response } from "express";
import { container } from "tsyringe";
import { CanceledEventUseCase } from "./CanceledEventUseCase";

class CanceledEventController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const canceledEventUseCase = container.resolve(CanceledEventUseCase);

    const event = await canceledEventUseCase.execute(id);

    return response.status(201).json(event);
  }
}

export { CanceledEventController };
