import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCouponUseCase } from "./CreateCouponUseCase";

class CreateCouponController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      code,
      amount,
      limit,
      expiration_date,
    } = request.body;
    const createCouponUseCase = container.resolve(CreateCouponUseCase);

    const coupon = await createCouponUseCase.execute({
      code,
      amount,
      limit,
      expiration_date,
    });

    return response.status(201).json(coupon);
  }
}

export { CreateCouponController };
