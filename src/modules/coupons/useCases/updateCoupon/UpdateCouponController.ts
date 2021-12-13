import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateCouponUseCase } from "./UpdateCouponUseCase";

class UpdateCouponController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const {
      code,
      amount,
      user_id,
    } = request.body;
    const { id: admin_id } = request.user;

    const updateCouponUseCase = container.resolve(UpdateCouponUseCase);

    const event = await updateCouponUseCase.execute(
      {
        id,
        code,
        amount,
        user_id,
      },
      admin_id
    );

    return response.status(201).send(event);
  }
}

export { UpdateCouponController };
