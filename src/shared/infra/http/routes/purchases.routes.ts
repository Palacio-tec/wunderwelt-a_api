import { Router } from "express";

import { CreatePaymentReferenceController } from "@modules/purchases/useCases/createPaymentReference/CreatePaymentReferenceController";
import { CreatePurchaseOrderController } from "@modules/purchases/useCases/createPurchaseOrder/CreatePurchaseOrderController";
import { CreatePurchaseOrderWebhookController } from "@modules/purchases/useCases/createPurchaseOrderWebhook/CreatePurchaseOrderWebhookController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const purchasesRoutes = Router();

const createPaymentReferenceController = new CreatePaymentReferenceController();
const createPurchaseOrderController = new CreatePurchaseOrderController();
const createPurchaseOrderWebhookController = new CreatePurchaseOrderWebhookController();

purchasesRoutes.post("/reference", ensureAuthenticated, createPaymentReferenceController.handle);
purchasesRoutes.post("/payment", createPurchaseOrderController.handle);
purchasesRoutes.post("/payment-webhook", createPurchaseOrderWebhookController.handle);

export { purchasesRoutes };
