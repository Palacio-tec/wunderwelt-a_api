import { Request, Response } from "express";
import { container } from "tsyringe";
import { CanDeleteCouponUseCase } from "./CanDeleteCouponUseCase";

class CanDeleteCouponController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.query.id);

    const canDeleteCouponUseCase = container.resolve(CanDeleteCouponUseCase);

    const validation = await canDeleteCouponUseCase.execute(id);

    return response.status(201).json(validation);
  }
}

export { CanDeleteCouponController };
