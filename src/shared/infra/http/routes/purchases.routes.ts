import { Router } from "express";

import { CreatePurchaseOrderController } from "@modules/purchases/useCases/createPurchaseOrder/CreatePurchaseOrderController";
import { CreatePaymentReferenceController } from "@modules/purchases/useCases/createPaymentReference/CreatePaymentReferenceController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const purchasesRoutes = Router();

const createPaymentReferenceController = new CreatePaymentReferenceController();
const createPurchaseOrderController = new CreatePurchaseOrderController();

purchasesRoutes.post("/reference", ensureAuthenticated, createPaymentReferenceController.handle);
purchasesRoutes.post("/payment", createPurchaseOrderController.handle);

export { purchasesRoutes };
