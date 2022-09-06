import { Request, Response } from "express";
import { container } from "tsyringe";
import { AvailableCouponUseCase } from "./AvailableCouponUseCase";

class AvailableCouponControler {
  async handle(request: Request, response: Response): Promise<Response> {
    const code = String(request.params.code).toUpperCase();

    const availableCouponUseCase = container.resolve(AvailableCouponUseCase);

    const validation = await availableCouponUseCase.execute(code);

    return response.status(201).json(validation);
  }
}

export { AvailableCouponControler };
