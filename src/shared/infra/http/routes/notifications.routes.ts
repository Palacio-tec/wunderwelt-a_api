import { Router } from "express";

import { ListUserNotificationController } from "@modules/notifications/useCases/listUserMailLog/ListNotificationsController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const notificationsRoutes = Router();

const listUserNotificationsController = new ListUserNotificationController();

notificationsRoutes.get(
  "/",
  ensureAuthenticated,
  listUserNotificationsController.handle
);

export { notificationsRoutes };