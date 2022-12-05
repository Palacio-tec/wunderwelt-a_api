import { Router } from "express";

import { CreateFQAController } from "@modules/fqas/useCases/createFQA/CreateFQAController";
import { ListFQAsController } from "@modules/fqas/useCases/listFQAs/ListFQAsController";
import { UpdateFQAController } from "@modules/fqas/useCases/updateFQA/UpdateFQAController";
import { DeleteFQAController } from "@modules/fqas/useCases/deleteFQA/DeleteFQAController";
import { FindFQAController } from "@modules/fqas/useCases/findFQA/FindFQAController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { SendSupportMailController } from "@modules/fqas/useCases/sendSupportMail/SendSupportMailController";

const fqasRoutes = Router();

const createFQAController = new CreateFQAController();
const listFQAsController = new ListFQAsController();
const updateFQAController = new UpdateFQAController();
const deleteFQAController = new DeleteFQAController();
const findFQAController = new FindFQAController();
const sendSupportMailController = new SendSupportMailController();

fqasRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createFQAController.handle
);

fqasRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  listFQAsController.handle
)

fqasRoutes.post(
  "/update/:id",
  ensureAuthenticated,
  ensureAdmin,
  updateFQAController.handle
)

fqasRoutes.delete(
  '/:id',
  ensureAuthenticated,
  ensureAdmin,
  deleteFQAController.handle
)

fqasRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  findFQAController.handle
)

fqasRoutes.post(
  "/support",
  ensureAuthenticated,
  sendSupportMailController.handle
)

export { fqasRoutes };
