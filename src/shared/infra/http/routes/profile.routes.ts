import { Router } from "express";

import { ShowProfileController } from "@modules/accounts/useCases/showProfile/ShowProfileController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ProfileFieldsController } from "@modules/accounts/useCases/validations/profileFields/ProfileFieldsController";
import { ProfilePasswordMatchController } from "@modules/accounts/useCases/validations/profilePasswordMatch/ProfilePasswordMatchController";
import { UpdateProfileController } from "@modules/accounts/useCases/updateProfile/UpdateProfileController";
import { UnsubscribeNewsletterController } from "@modules/accounts/useCases/unsubscribeNewsletter/UnsubscribeNewsletterController";
import { UnsubscribeUserController } from "@modules/accounts/useCases/unsubscribeUser/UnsubscribeUserController";

const profileRoutes = Router();

const showProfileController = new ShowProfileController();
const profileFieldsController = new ProfileFieldsController();
const profilePasswordMatchController = new ProfilePasswordMatchController();
const updateProfileController = new UpdateProfileController();
const unsubscribeNewsletterController = new UnsubscribeNewsletterController();
const unsubscribeUserController = new UnsubscribeUserController();

profileRoutes.get(
  "/",
  ensureAuthenticated,
  showProfileController.handle
);

profileRoutes.get(
  "/valid",
  ensureAuthenticated,
  profileFieldsController.handle
);

profileRoutes.get(
  "/valid/password",
  ensureAuthenticated,
  profilePasswordMatchController.handle
);

profileRoutes.post(
  "/",
  ensureAuthenticated,
  updateProfileController.handle
)

profileRoutes.post(
  "/unsubscribe/news",
  unsubscribeNewsletterController.handle
)

profileRoutes.post(
  "/unsubscribe/all",
  unsubscribeNewsletterController.handle
)

profileRoutes.delete(
  "/",
  ensureAuthenticated,
  unsubscribeUserController.handle
)

export { profileRoutes };
