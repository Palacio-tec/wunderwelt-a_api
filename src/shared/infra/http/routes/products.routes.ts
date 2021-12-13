import { Router } from "express";

import { ListProductsController } from "@modules/products/useCases/listProduct/ListProductController";
import { UpdateProductController } from "@modules/products/useCases/updateProduct/UpdateProductController";
import { FindProductController } from "@modules/products/useCases/findProduct/FindProductController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const productsRoutes = Router();

const listProductsController = new ListProductsController();
const updateProductController = new UpdateProductController();
const findProductController = new FindProductController();

productsRoutes.get(
  "/",
  ensureAuthenticated,
  listProductsController.handle
)

productsRoutes.post(
  "/update/:id",
  ensureAuthenticated,
  ensureAdmin,
  updateProductController.handle
)

productsRoutes.get(
  "/find/:id",
  ensureAuthenticated,
  ensureAdmin,
  findProductController.handle
)

export { productsRoutes };
