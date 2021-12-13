import { Request, Response } from "express";
import { container } from "tsyringe";

import { FindCouponUseCase } from "./FindCouponUseCase";

class FindCouponController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const findCouponUseCase = container.resolve(FindCouponUseCase);

    const coupon = await findCouponUseCase.execute(id);

    return response.status(201).json(coupon);
  }
}

export { FindCouponController };
