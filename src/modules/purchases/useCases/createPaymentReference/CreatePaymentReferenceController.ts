import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreatePaymentReferenceUseCase } from "./CreatePaymentReferenceUseCase";

class CreatePaymentReferenceController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      product_id,
      product_value,
      street_name,
      street_number,
      zip_code,
      area_code,
      phone,
      document,
      couponId,
    } = request.body;
    const user_id = request.user.id;

    const createPaymentReferenceUseCase = container.resolve(CreatePaymentReferenceUseCase);

    const paymentReference = await createPaymentReferenceUseCase.execute({
      user_id,
      product_id,
      product_value,
      street_name,
      street_number,
      zip_code,
      area_code,
      phone,
      document,
      couponId
    });

    return response.status(201).json(paymentReference);
  }
}

export { CreatePaymentReferenceController };
