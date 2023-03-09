import { Router } from "express";

import { ListUserNotificationController } from "@modules/notifications/useCases/listUserNotifications/ListUserNotificationsController";
import { UpdateNotificationController } from "@modules/notifications/useCases/updateNotification/UpdateNotificationController";
import { FindUserNotificationController } from "@modules/notifications/useCases/findUserNotification/FindUserNotificationController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { SetReadAllNotificationController } from "@modules/notifications/useCases/setReadAllNotification/SetReadAllNotificationController";

const notificationsRoutes = Router();

const listUserNotificationsController = new ListUserNotificationController();
const updateNotificationController = new UpdateNotificationController();
const findUserNotificationController = new FindUserNotificationController();
const setReadAllNotificationController = new SetReadAllNotificationController();

notificationsRoutes.get(
  "/",
  ensureAuthenticated,
  listUserNotificationsController.handle
);

notificationsRoutes.get(
  "/:id",
  ensureAuthenticated,
  findUserNotificationController.handle
);

notificationsRoutes.post(
  "/:id",
  ensureAuthenticated,
  updateNotificationController.handle
);

notificationsRoutes.post(
  "/read/all",
  ensureAuthenticated,
  setReadAllNotificationController.handle
);

export { notificationsRoutes };
