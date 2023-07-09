import { Router } from "express";

import { ListAvailableMembersController } from "@modules/companyMembers/useCases/listAvailableMembers/ListAvailableMembersController";
import { CreateCompanyMemberController } from "@modules/companyMembers/useCases/createCompanyMember/CreateCompanyMemberController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ListCompaniesController } from "@modules/companyMembers/useCases/listCompanies/ListCompaniesController";
import { FindCompanyMembersByCompanyIdController } from "@modules/companyMembers/useCases/findCompanyMembersByCompanyId/FindCompanyMembersByCompanyIdController";
import { ListAvailableMembersAndCurrentController } from "@modules/companyMembers/useCases/listAvailableMembersAndCurrent/ListAvailableMembersAndCurrentController";
import { FindCompanyMembersByCompanyIdAndAvailableController } from "@modules/companyMembers/useCases/findCompanyMembersByCompanyIdAndAvailable/FindCompanyMembersByCompanyIdAndAvailableController";
import { UpdateCompanyMemberController } from "@modules/companyMembers/useCases/updateCompanyMember/UpdateCompanyMemberController";
import { DeleteCompanyMemberController } from "@modules/companyMembers/useCases/deleteCompanyMember/DeleteCompanyMemberController";
import { FindCompanyMembersByMyIdController } from "@modules/companyMembers/useCases/findCompanyMembersByMyId/FindCompanyMembersByMyIdController";
import { ListMembersHistoricController } from "@modules/companyMembers/useCases/listMembersHistoric/ListMembersHistoricController";

const companyMembersRoutes = Router();

const listAvailableMembersController = new ListAvailableMembersController();
const createCompanyMemberController = new CreateCompanyMemberController();
const listCompaniesController = new ListCompaniesController();
const findCompanyMembersByCompanyIdController = new FindCompanyMembersByCompanyIdController();
const listAvailableMembersAndCurrentController = new ListAvailableMembersAndCurrentController();
const findCompanyMembersByCompanyIdAndAvailableController = new FindCompanyMembersByCompanyIdAndAvailableController()
const updateCompanyMemberController = new UpdateCompanyMemberController()
const deleteCompanyMemberController = new DeleteCompanyMemberController()
const findCompanyMembersByMyIdController = new FindCompanyMembersByMyIdController()
const listMembersHistoricController = new ListMembersHistoricController()

companyMembersRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createCompanyMemberController.handle
)

companyMembersRoutes.get(
  "/companies",
  ensureAuthenticated,
  ensureAdmin,
  listCompaniesController.handle
)

companyMembersRoutes.get(
  "/companies/:company_id",
  ensureAuthenticated,
  ensureAdmin,
  listAvailableMembersAndCurrentController.handle
)

companyMembersRoutes.get(
  "/members/available",
  ensureAuthenticated,
  ensureAdmin,
  listAvailableMembersController.handle
);

companyMembersRoutes.get(
  "/find/:company_id",
  ensureAuthenticated,
  ensureAdmin,
  findCompanyMembersByCompanyIdController.handle
);

companyMembersRoutes.get(
  "/find/:company_id/available",
  ensureAuthenticated,
  ensureAdmin,
  findCompanyMembersByCompanyIdAndAvailableController.handle
);

companyMembersRoutes.post(
  "/update",
  ensureAuthenticated,
  ensureAdmin,
  updateCompanyMemberController.handle
)

companyMembersRoutes.delete(
  "/:company_id",
  ensureAuthenticated,
  ensureAdmin,
  deleteCompanyMemberController.handle
)

companyMembersRoutes.get(
  "/find",
  ensureAuthenticated,
  findCompanyMembersByMyIdController.handle
)

companyMembersRoutes.get(
  "/members/historic",
  ensureAuthenticated,
  listMembersHistoricController.handle
)

export { companyMembersRoutes };
