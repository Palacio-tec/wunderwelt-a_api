import { Router } from "express";

import { ListUserMailLogController } from "@modules/mailLogs/useCases/listUserMailLog/ListUserMailLogController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const mailLogsRoutes = Router();

const listUserMailLogController = new ListUserMailLogController();

mailLogsRoutes.get(
  "/find/:id",
  ensureAuthenticated,
  ensureAdmin,
  listUserMailLogController.handle
);

export { mailLogsRoutes };