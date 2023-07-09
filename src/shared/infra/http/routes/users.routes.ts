import { Router } from "express";

import { CreateUserController } from "@modules/accounts/useCases/createUser/CreateUserController";
import { UserFieldsController } from "@modules/accounts/useCases/validations/userFields/UserFieldsController";
import { ListUsersController } from "@modules/accounts/useCases/listUsers/ListUsersController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { FindUserController } from "@modules/accounts/useCases/findUser/FindUserController";
import { DeleteUserController } from "@modules/accounts/useCases/deleteUser/DeleteUserController";
import { DisableUserController } from "@modules/accounts/useCases/disabledUser/DisableUserController";
import { UpdateUserController } from "@modules/accounts/useCases/updateUser/UpdateUserController";
import { CanDeleteUserController } from "@modules/accounts/useCases/validations/canDeleteUser/CanDeleteUserController";
import { ListTeachersController } from "@modules/accounts/useCases/listTeachers/ListTeachersController";
import { SendGiftController } from "@modules/accounts/useCases/sendGift/SendGiftController";
import { ImpersonateUserController } from "@modules/accounts/useCases/impersonateUser/ImpersonateUserController";
import { ListCompanyUsersController } from "@modules/accounts/useCases/listCompanyUsers/ListCompanyUsersController";
import { ListCompanyUsersAvailableController } from "@modules/accounts/useCases/listCompanyUsersAvailable/ListCompanyUsersAvailableController";

const usersRoutes = Router();

const createUserController = new CreateUserController();
const userFieldsController = new UserFieldsController();
const listUsersController = new ListUsersController();
const findUserController = new FindUserController();
const deleteUserController = new DeleteUserController();
const disableUserController = new DisableUserController();
const updateUserController = new UpdateUserController();
const canDeleteUserController = new CanDeleteUserController();
const listTeachersController = new ListTeachersController();
const sendGiftController = new SendGiftController();
const impersonateUserController = new ImpersonateUserController();
const listCompanyUsersController = new ListCompanyUsersController();
const listCompanyUsersAvailableController = new ListCompanyUsersAvailableController();

usersRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createUserController.handle
);

usersRoutes.post(
  "/signUp",
  createUserController.handle
);

usersRoutes.get(
  "/valid",
  userFieldsController.handle
)

usersRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  listUsersController.handle
)

usersRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  findUserController.handle
);

usersRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  deleteUserController.handle
)

usersRoutes.post(
  "/disabled/:id",
  ensureAuthenticated,
  ensureAdmin,
  disableUserController.handle
)

usersRoutes.post(
  "/update/:id",
  ensureAuthenticated,
  ensureAdmin,
  updateUserController.handle
)

usersRoutes.get(
  "/valid/delete",
  ensureAuthenticated,
  ensureAdmin,
  canDeleteUserController.handle
)

usersRoutes.get(
  "/list/teachers",
  ensureAuthenticated,
  ensureAdmin,
  listTeachersController.handle
)

usersRoutes.post(
  "/send-gift",
  ensureAuthenticated,
  ensureAdmin,
  sendGiftController.handle
)

usersRoutes.post(
  "/impersonate",
  ensureAuthenticated,
  ensureAdmin,
  impersonateUserController.handle
);

usersRoutes.get(
  "/list/company",
  ensureAuthenticated,
  ensureAdmin,
  listCompanyUsersController.handle
);

usersRoutes.get(
  "/list/company-available",
  ensureAuthenticated,
  ensureAdmin,
  listCompanyUsersAvailableController.handle
);

export { usersRoutes };
