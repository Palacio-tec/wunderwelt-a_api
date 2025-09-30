import { Router } from "express";

import { CreateTemplateController } from "@modules/templates/useCases/createTemplate/CreateTemplateController";
import { ListTemplatesController } from "@modules/templates/useCases/listTemplates/ListTemplatesController";
import { FindTemplateController } from "@modules/templates/useCases/findTemplate/FindTemplateController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const templatesRoutes = Router();

const createTemplateController = new CreateTemplateController();
const listTemplatesController = new ListTemplatesController();
const findTemplateController = new FindTemplateController();

templatesRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createTemplateController.handle
);

templatesRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  listTemplatesController.handle
);

templatesRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  findTemplateController.handle
);

export { templatesRoutes };
