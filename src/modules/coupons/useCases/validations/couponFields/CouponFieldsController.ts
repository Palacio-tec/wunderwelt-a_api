import { Request, Response } from "express";
import { container } from "tsyringe";
import { CouponFieldsUseCase } from "./CouponFieldsUseCase";

class CouponFieldsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const field = String(request.query.field);
    const value = String(request.query.value);
    const id = request.query.id;

    const couponFieldsUseCase = container.resolve(CouponFieldsUseCase);

    const couponExists = await couponFieldsUseCase.execute(field, value, id as string);

    return response.status(201).json(couponExists);
  }
}

export { CouponFieldsController };
