import { Router } from "express";

import { CreatePromotionController } from "@modules/promotions/useCases/createPromotion/CreatePromotionController";
import { ListPromotionsController } from "@modules/promotions/useCases/listPromotions/ListPromotionsController";
import { UpdatePromotionController } from "@modules/promotions/useCases/updatePromotion/UpdatePromotionController";
import { DeletePromotionController } from "@modules/promotions/useCases/deletePromotion/DeletePromotionController";
import { FindPromotioController } from "@modules/promotions/useCases/findPromotion/FindPromotioController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const promotionsRoutes = Router();

const createPromotionController = new CreatePromotionController();
const listPromotionsController = new ListPromotionsController();
const updatePromotionController = new UpdatePromotionController();
const deletePromotionController = new DeletePromotionController();
const findPromotioController = new FindPromotioController();

promotionsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createPromotionController.handle
);

promotionsRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  listPromotionsController.handle
)

promotionsRoutes.post(
  "/update/:id",
  ensureAuthenticated,
  ensureAdmin,
  updatePromotionController.handle
)

promotionsRoutes.delete(
  '/:id',
  ensureAuthenticated,
  ensureAdmin,
  deletePromotionController.handle
)

promotionsRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  findPromotioController.handle
)

export { promotionsRoutes };
