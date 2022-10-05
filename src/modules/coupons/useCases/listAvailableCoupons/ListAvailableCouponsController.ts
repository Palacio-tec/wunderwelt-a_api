import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import { ListAvailableCouponsUseCase } from "./ListAvailableCouponsUseCase";

class ListAvailableCouponsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listAvailableCouponsUseCase = container.resolve(ListAvailableCouponsUseCase);

    const coupons = await listAvailableCouponsUseCase.execute();

    return response.status(201).json(classToClass(coupons));
  }
}

export { ListAvailableCouponsController };
