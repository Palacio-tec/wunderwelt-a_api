import { Router } from "express";

import { CreateCouponController } from "@modules/coupons/useCases/createCoupon/CreateCouponController";
import { ConsumeCouponController } from "@modules/coupons/useCases/consumeCoupon/ConsumeCouponController";
import { ListCouponsController } from "@modules/coupons/useCases/listCoupons/ListCouponsController";
import { UpdateCouponController } from "@modules/coupons/useCases/updateCoupon/UpdateCouponController";
import { FindCouponController } from "@modules/coupons/useCases/findCoupon/FindCouponController";
import { DeleteCouponController } from "@modules/coupons/useCases/deleteCoupon/DeleteCouponController";
import { CanDeleteCouponController } from "@modules/coupons/useCases/validations/canDeleteCoupon/CanDeleteCouponController";
import { CouponFieldsController } from "@modules/coupons/useCases/validations/couponFields/CouponFieldsController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { AvailableCouponControler } from "@modules/coupons/useCases/validations/availableCoupon/AvailableCouponController";
import { ListAvailableCouponsController } from "@modules/coupons/useCases/listAvailableCoupons/ListAvailableCouponsController";

const couponsRoutes = Router();

const createCouponController = new CreateCouponController();
const consumeCouponController = new ConsumeCouponController();
const listCouponsController = new ListCouponsController();
const updateCouponController = new UpdateCouponController();
const deleteCouponController = new DeleteCouponController();
const findCouponController = new FindCouponController();
const canDeleteCouponController = new CanDeleteCouponController();
const couponFieldsController = new CouponFieldsController();
const availableCouponControler = new AvailableCouponControler();
const listAvailableCouponsController = new ListAvailableCouponsController();

couponsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createCouponController.handle
);

couponsRoutes.post(
  "/consume",
  ensureAuthenticated,
  consumeCouponController.handle
);

couponsRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  listCouponsController.handle
)

couponsRoutes.post(
  "/update/:id",
  ensureAuthenticated,
  ensureAdmin,
  updateCouponController.handle
)

couponsRoutes.delete(
  '/:id',
  ensureAuthenticated,
  ensureAdmin,
  deleteCouponController.handle
)

couponsRoutes.get(
  "/valid/delete",
  ensureAuthenticated,
  ensureAdmin,
  canDeleteCouponController.handle
)

couponsRoutes.get(
  "/valid",
  ensureAuthenticated,
  ensureAdmin,
  couponFieldsController.handle
)

couponsRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  findCouponController.handle
)

couponsRoutes.get(
  "/available/:code",
  ensureAuthenticated,
  availableCouponControler.handle
)

couponsRoutes.get(
  "/list/available",
  ensureAuthenticated,
  ensureAdmin,
  listAvailableCouponsController.handle
)

export { couponsRoutes };
