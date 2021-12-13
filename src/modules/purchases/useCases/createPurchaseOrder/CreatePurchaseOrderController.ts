import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreatePurchaseOrderUseCase } from "./CreatePurchaseOrderUseCase";

class CreatePurchaseOrderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { action, data, api_version } = request.body;

    const payment_id = data.id;

    const createPurchaseOrderUseCase = container.resolve(CreatePurchaseOrderUseCase);

    let purchaseOrder = {}

    if (!api_version) {
      purchaseOrder = await createPurchaseOrderUseCase.execute(action, payment_id);
    } else {
      createPurchaseOrderUseCase.execute(action, payment_id);
    }

    return response.status(201).json(purchaseOrder);
  }
}

export { CreatePurchaseOrderController };
