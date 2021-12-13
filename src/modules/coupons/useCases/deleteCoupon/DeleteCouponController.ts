import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteCouponUseCase } from "./DeleteCouponUseCase";

class DeleteCouponController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const user_id = request.user.id;

    const deleteCouponUseCase = container.resolve(DeleteCouponUseCase);

    await deleteCouponUseCase.execute({ id: String(id), user_id });

    return response.status(201).send();
  }
}

export { DeleteCouponController };
