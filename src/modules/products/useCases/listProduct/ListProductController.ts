import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import { ListProductsUseCase } from "./ListProductsUseCase";

class ListProductsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listProductsUseCase = container.resolve(ListProductsUseCase);

    const products = await listProductsUseCase.execute();

    return response.status(201).json(classToClass(products));
  }
}

export { ListProductsController };
