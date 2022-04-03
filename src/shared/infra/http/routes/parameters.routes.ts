import { Router } from "express";

import { UpdateParameterController } from "@modules/parameters/useCases/updateParameter/UpdateParameterController";
import { ListParametersController } from "@modules/parameters/useCases/listParameters/ListParametersController";
import { FindParameterController } from "@modules/parameters/useCases/findParameter/FindParameterController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ConsultParameterController } from "@modules/parameters/useCases/consultParameter.ts/ConsultParameterController";
import { CreateParameterController } from "@modules/parameters/useCases/createParameter/CreateParameterController";

const parametersRoutes = Router();

const createParameterController = new CreateParameterController();
const updateParameterController = new UpdateParameterController();
const listParametersController = new ListParametersController();
const findParameterController = new FindParameterController();
const consultParameterController = new ConsultParameterController();

parametersRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createParameterController.handle
)

parametersRoutes.post(
  "/update/:id",
  ensureAuthenticated,
  ensureAdmin,
  updateParameterController.handle
);

parametersRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  listParametersController.handle
);

parametersRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  findParameterController.handle
);

parametersRoutes.get("/consult/:reference", consultParameterController.handle);

export { parametersRoutes };
