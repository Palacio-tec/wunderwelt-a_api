import { Router } from "express";

import { ListAvailableHoursController } from "@modules/accounts/useCases/listAvailableHours/ListAvailableHoursController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const creditsRoutes = Router();

const listAvailableHoursController = new ListAvailableHoursController();

creditsRoutes.get(
  "/available",
  ensureAuthenticated,
  listAvailableHoursController.handle
)

export { creditsRoutes };
