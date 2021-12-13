import { Router } from "express";

import { GetUserBalanceController } from "@modules/statements/useCase/getUserBalance/GetUserBalanceController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const statementsRoutes = Router();

const getUserBalanceController = new GetUserBalanceController();

statementsRoutes.get("/", ensureAuthenticated, getUserBalanceController.handle);

export { statementsRoutes };
