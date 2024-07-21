import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateProductUseCase } from "./UpdateProductUseCase";

class UpdateProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const {
      name,
      description,
      amount,
      value,
      is_active,
      original_amount,
      original_value
    } = request.body;
    const user_id = request.user.id;

    const updateProductUseCase = container.resolve(UpdateProductUseCase);

    const product = await updateProductUseCase.execute(
      {
        id,
        name,
        description,
        amount,
        value,
        is_active,
        original_amount,
        original_value,
      },
      user_id
    );

    return response.status(201).json(product);
  }
}

export { UpdateProductController };
