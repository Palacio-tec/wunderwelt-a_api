import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import { ListOnlyActivatedProductsUseCase } from "./ListOnlyActivatedProductsUseCase";

class ListOnlyActivatedProductsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listOnlyActivatedProductsUseCase = container.resolve(ListOnlyActivatedProductsUseCase);

    const products = await listOnlyActivatedProductsUseCase.execute();

    return response.status(201).json(classToClass(products));
  }
}

export { ListOnlyActivatedProductsController };
