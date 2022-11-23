import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { CreateScheduleController } from "@modules/schedules/useCases/createSchedule/CreateScheduleController";
import { ListSchedulesByUserController } from "@modules/schedules/useCases/listSchedulesByUser/ListSchedulesByUserController";
import { DeleteScheduleController } from "@modules/schedules/useCases/deleteSchedule/DeleteScheduleController";
import { ListSchedulesController } from "@modules/schedules/useCases/listSchedules/ListSchedulesController";
import { ListParticipationsController } from "@modules/schedules/useCases/listParticipations/ListParticipationsController";
import { FindByEventIdController } from "@modules/schedules/useCases/findByEventId/FindByEventIdController";

import { ensureAdmin } from "../middlewares/ensureAdmin";

const schedulesRoutes = Router();

const createScheduleController = new CreateScheduleController();
const listSchedulesByUserController = new ListSchedulesByUserController();
const deleteScheduleController = new DeleteScheduleController();
const listSchedulesController = new ListSchedulesController();
const listParticipationsController = new ListParticipationsController();
const findByEventIdController = new FindByEventIdController();

schedulesRoutes.post(
  "/",
  ensureAuthenticated,
  createScheduleController.handle
);

schedulesRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  listSchedulesController.handle
);

schedulesRoutes.get(
  "/mine",
  ensureAuthenticated,
  listSchedulesByUserController.handle
);

schedulesRoutes.delete(
  "/:eventId",
  ensureAuthenticated,
  deleteScheduleController.handle
)

schedulesRoutes.get(
  "/participations",
  ensureAuthenticated,
  ensureAdmin,
  listParticipationsController.handle
)

schedulesRoutes.get(
  "/students/:eventId",
  ensureAuthenticated,
  ensureAdmin,
  findByEventIdController.handle
)

export { schedulesRoutes };
