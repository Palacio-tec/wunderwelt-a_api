import { Request, Response } from "express";
import { container } from "tsyringe";
import { ConsumeCouponUseCase } from "./ConsumeCouponUseCase";

class ConsumeCouponController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { code } = request.body;

    const user_id = request.user.id;

    const consumeCouponUseCase = container.resolve(ConsumeCouponUseCase);

    const coupon = await consumeCouponUseCase.execute({ code, user_id });

    return response.status(201).json(coupon);
  }
}

export { ConsumeCouponController };
