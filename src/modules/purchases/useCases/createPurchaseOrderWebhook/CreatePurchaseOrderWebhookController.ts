import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreatePurchaseOrderWebhookUseCase } from "./CreatePurchaseOrderWebhookUseCase";

class CreatePurchaseOrderWebhookController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { action, data } = request.body;

    const payment_id = data.id;

    const createPurchaseOrderWebhookUseCase = container.resolve(CreatePurchaseOrderWebhookUseCase);

    console.info('WEBHOOK MP', request)

    createPurchaseOrderWebhookUseCase.execute(action, payment_id);

    return response.status(201).send();
  }
}

export { CreatePurchaseOrderWebhookController };
