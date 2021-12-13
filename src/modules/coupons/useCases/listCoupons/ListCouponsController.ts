import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import { ListCouponsUseCase } from "./ListCouponsUseCase";

class ListCouponsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listCouponsUseCase = container.resolve(ListCouponsUseCase);

    const coupons = await listCouponsUseCase.execute();

    return response.status(201).json(classToClass(coupons));
  }
}

export { ListCouponsController };
