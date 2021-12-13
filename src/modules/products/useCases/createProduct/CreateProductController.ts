import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateProductUseCase } from "./CreateProductUseCase";

class CreateProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      name,
      description,
      amount,
      value
    } = request.body;
    const user_id = request.user.id;

    const createProductUseCase = container.resolve(CreateProductUseCase);

    const product = await createProductUseCase.execute(
      {
        name,
        description,
        amount,
        value,
      },
      user_id
    );

    return response.status(201).json(product);
  }
}

export { CreateProductController };
