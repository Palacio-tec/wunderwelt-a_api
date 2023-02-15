import { Router } from "express";

import { ListUserNotificationController } from "@modules/notifications/useCases/listUserNotifications/ListUserNotificationsController";
import { UpdateNotificationController } from "@modules/notifications/useCases/updateNotification/UpdateNotificationController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const notificationsRoutes = Router();

const listUserNotificationsController = new ListUserNotificationController();
const updateNotificationController = new UpdateNotificationController();

notificationsRoutes.get(
  "/",
  ensureAuthenticated,
  listUserNotificationsController.handle
);

notificationsRoutes.post(
  "/:id",
  ensureAuthenticated,
  updateNotificationController.handle
);

export { notificationsRoutes };
