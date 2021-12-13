import { Router } from "express";

import { ShowProfileController } from "@modules/accounts/useCases/showProfile/ShowProfileController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ProfileFieldsController } from "@modules/accounts/useCases/validations/profileFields/ProfileFieldsController";
import { ProfilePasswordMatchController } from "@modules/accounts/useCases/validations/profilePasswordMatch/ProfilePasswordMatchController";
import { UpdateProfileController } from "@modules/accounts/useCases/updateProfile/UpdateProfileController";

const profileRoutes = Router();

const showProfileController = new ShowProfileController();
const profileFieldsController = new ProfileFieldsController();
const profilePasswordMatchController = new ProfilePasswordMatchController();
const updateProfileController = new UpdateProfileController();

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

export { profileRoutes };
