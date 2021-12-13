import { Router } from "express";

import { ListLevelsController } from "@modules/levels/useCases/listLevels/ListLevelsController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { CreateLevelController } from "@modules/levels/useCases/createLevel/CreateLevelController";
import { UpdateLevelController } from "@modules/levels/useCases/updateLevel/UpdateLevelController";
import { DeleteLevelController } from "@modules/levels/useCases/deleteLevel/DeleteLevelController";
import { LevelFieldsController } from "@modules/levels/useCases/validations/levelFields/LevelFieldsController";
import { FindLevelController } from "@modules/levels/useCases/findLevel/FindLevelController";
import { CanDeleteLevelController } from "@modules/levels/useCases/validations/canDeleteLevel/CanDeleteLevelController";

const levelsRoutes = Router();

const listLevelsController = new ListLevelsController();
const createLevelController = new CreateLevelController();
const updateLevelController = new UpdateLevelController();
const deleteLevelController = new DeleteLevelController();
const levelFieldsController = new LevelFieldsController();
const findLevelController = new FindLevelController();
const canDeleteLevel = new CanDeleteLevelController()

levelsRoutes.get(
  "/",
  ensureAuthenticated,
  listLevelsController.handle
);

levelsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createLevelController.handle
)

levelsRoutes.post(
  "/update/:id",
  ensureAuthenticated,
  ensureAdmin,
  updateLevelController.handle
)

levelsRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  deleteLevelController.handle
)

levelsRoutes.get(
  "/valid",
  ensureAuthenticated,
  ensureAdmin,
  levelFieldsController.handle
);

levelsRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  findLevelController.handle
);

levelsRoutes.get(
  "/valid/delete",
  ensureAuthenticated,
  ensureAdmin,
  canDeleteLevel.handle
)

export { levelsRoutes };
