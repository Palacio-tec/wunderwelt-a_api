import { Router } from "express";

import { SendMailController } from "@modules/configurations/useCases/sendMail/SendMailController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const configurationsRoutes = Router();

const sendMailController = new SendMailController();

configurationsRoutes.post(
  "/mail-test",
  ensureAuthenticated,
  ensureAdmin,
  sendMailController.handle
);

export { configurationsRoutes };
