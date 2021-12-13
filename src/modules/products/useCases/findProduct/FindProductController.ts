import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindProductUseCase } from "./FindProductUseCase";

class FindProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const findProductUseCase = container.resolve(FindProductUseCase);

    const product = await findProductUseCase.execute(id);

    return response.status(201).json(product);
  }
}

export { FindProductController };
