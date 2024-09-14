import { Router } from "express";

import { ListAvailableHoursController } from "@modules/accounts/useCases/listAvailableHours/ListAvailableHoursController";
import { ListAvailableHoursForUserController } from "@modules/accounts/useCases/listAvailableHoursForUser/ListAvailableHoursForUserController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const creditsRoutes = Router();

const listAvailableHoursController = new ListAvailableHoursController();
const listAvailableHoursForUserController = new ListAvailableHoursForUserController();

creditsRoutes.get(
  "/available",
  ensureAuthenticated,
  listAvailableHoursController.handle
)

creditsRoutes.get(
  "/available/:userId",
  ensureAuthenticated,
  listAvailableHoursForUserController.handle
)

export { creditsRoutes };
