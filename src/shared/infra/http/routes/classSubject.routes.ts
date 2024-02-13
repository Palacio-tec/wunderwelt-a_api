import { Router } from "express";

import { CreateClassSubjectController } from "@modules/classSubjects/useCases/createClassSubject/CreateClassSubjectController";
import { DeleteClassSubjectController } from "@modules/classSubjects/useCases/deleteClassSubject/DeleteClassSubjectController";
import { FindClassSubjectController } from "@modules/classSubjects/useCases/findClassSubject/FindClassSubjectController";
import { ListClassSubjectsController } from "@modules/classSubjects/useCases/listClassSubject/ListClassSubjectsController";
import { UpdateClassSubjectController } from "@modules/classSubjects/useCases/updateClassSubject/UpdateClassSubjectController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ClassSubjectFieldsController } from "@modules/classSubjects/useCases/validation/classSubjectFields/ClassSubjectFieldsController";
import { CanDeleteClassSubjectController } from "@modules/classSubjects/useCases/validation/canDeleteClassSubject/CanDeleteClassSubjectController";

const classSubjectsRoutes = Router();

const createClassSubjectController = new CreateClassSubjectController();
const listClassSubjectsController = new ListClassSubjectsController();
const updateClassSubjectController = new UpdateClassSubjectController();
const deleteClassSubjectController = new DeleteClassSubjectController();
const findClassSubjectController = new FindClassSubjectController();
const classSubjectFieldsController = new ClassSubjectFieldsController();
const canDeleteClassSubjectController = new CanDeleteClassSubjectController();

classSubjectsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createClassSubjectController.handle
);

classSubjectsRoutes.get(
  "/",
  ensureAuthenticated,
  listClassSubjectsController.handle
)

classSubjectsRoutes.post(
  "/update/:id",
  ensureAuthenticated,
  ensureAdmin,
  updateClassSubjectController.handle
)

classSubjectsRoutes.delete(
  '/:id',
  ensureAuthenticated,
  ensureAdmin,
  deleteClassSubjectController.handle
)

classSubjectsRoutes.get(
  "/find/:id",
  ensureAuthenticated,
  ensureAdmin,
  findClassSubjectController.handle
)

classSubjectsRoutes.get(
  "/valid",
  ensureAuthenticated,
  ensureAdmin,
  classSubjectFieldsController.handle
)

classSubjectsRoutes.get(
  "/valid/delete",
  ensureAuthenticated,
  ensureAdmin,
  canDeleteClassSubjectController.handle
)

export { classSubjectsRoutes };
