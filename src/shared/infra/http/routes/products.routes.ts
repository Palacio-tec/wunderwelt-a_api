import { Router } from "express";

import { ListProductsController } from "@modules/products/useCases/listProduct/ListProductController";
import { UpdateProductController } from "@modules/products/useCases/updateProduct/UpdateProductController";
import { FindProductController } from "@modules/products/useCases/findProduct/FindProductController";
import { ListOnlyActivatedProductsController } from "@modules/products/useCases/listOnlyAtivatedProducts/ListOnlyActivatedProductsController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { CreateProductController } from "@modules/products/useCases/createProduct/CreateProductController";

const productsRoutes = Router();

const listProductsController = new ListProductsController();
const createProductController = new CreateProductController();
const updateProductController = new UpdateProductController();
const findProductController = new FindProductController();
const listOnlyActivatedProductsController = new ListOnlyActivatedProductsController();

productsRoutes.get(
  "/",
  ensureAuthenticated,
  listProductsController.handle
)

productsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createProductController.handle
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

productsRoutes.get(
  "/active",
  ensureAuthenticated,
  listOnlyActivatedProductsController.handle
)

export { productsRoutes };
