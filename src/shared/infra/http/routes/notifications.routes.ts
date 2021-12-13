import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { UpdateNotificationController } from "@modules/notifications/useCases/updateNotification/UpdateNotificationController";
import { ListNotificationsController } from "@modules/notifications/useCases/listNotifications/ListNotificationsController";

const notificationsRoutes = Router();

const updateNotificationController = new UpdateNotificationController();
const listNotificationsController = new ListNotificationsController();

notificationsRoutes.post(
  "/:id",
  ensureAuthenticated,
  updateNotificationController.handle
);

notificationsRoutes.get(
  "/",
  ensureAuthenticated,
  listNotificationsController.handle
);

export { notificationsRoutes };
