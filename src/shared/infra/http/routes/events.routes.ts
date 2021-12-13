import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { CreateEventController } from "@modules/events/useCases/createEvent/CreateEventController";
import { ListEventsController } from "@modules/events/useCases/listEvents/ListEventsController";
import { ListAvailableEventsController } from "@modules/events/useCases/listAvailableEvents/ListAvailableEventsController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { CancelEventController } from "@modules/events/useCases/cancelEvent/CancelEventController";
import { DeleteEventController } from "@modules/events/useCases/deleteEvent/DeleteEventController";
import { ListEventsInMonthController } from "@modules/events/useCases/listEventsInMonth/ListEventsInMonthController";
import { UpdateEventControllet } from "@modules/events/useCases/updateEvent/UpdateEventController";
import { ListEventsInDayController } from "@modules/events/useCases/listEventsInDay/ListEventsInDayController";
import { ListUserEventsRegisteredController } from "@modules/events/useCases/listUserEventsRegistered/ListUserEventsRegisteredController";
import { ListUserEventsWaitingListController } from "@modules/events/useCases/listUserEventsWaitingList/ListUserEventsWaitingListController";
import { FindEventController } from "@modules/events/useCases/findEvent/FindEventController";
import { CanDeleteEventController } from "@modules/events/useCases/validations/canDeleteEvent/CanDeleteEventController";
import { CanceledEventController } from "@modules/events/useCases/canceledEvent/CanceledEventController";
import { ListEventsByTeacherController } from "@modules/events/useCases/listEventsByTeacher/ListEventsByTeacherController";
import { ListEventsMonthlyController } from "@modules/events/useCases/listEventsMonthly/ListEventsMonthlyController";

const eventsRoutes = Router();

const cancelEventController = new CancelEventController();
const createEventController = new CreateEventController();
const deleteEventController = new DeleteEventController();
const listEventsController = new ListEventsController();
const listAvailableEnventsController = new ListAvailableEventsController();
const listEventsInMonthController = new ListEventsInMonthController();
const updateEvent = new UpdateEventControllet();
const listEventsInDay = new ListEventsInDayController();
const listUserEventsRegisteredController = new ListUserEventsRegisteredController();
const listUserEventsWaitingListController = new ListUserEventsWaitingListController();
const findEventController = new FindEventController();
const canDeleteEventController = new CanDeleteEventController();
const canceledEventController = new CanceledEventController();
const listEventsByTeacherController = new ListEventsByTeacherController();
const listEventsMonthlyController = new ListEventsMonthlyController();

// eventsRoutes.post(
//   "/cancel",
//   ensureAuthenticated,
//   ensureAdmin,
//   cancelEventController.handle
// );

eventsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createEventController.handle
);

eventsRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  deleteEventController.handle
)

eventsRoutes.get("/", ensureAuthenticated, listEventsController.handle);

eventsRoutes.get(
  "/available",
  ensureAuthenticated,
  listAvailableEnventsController.handle
);

eventsRoutes.get(
  "/availability",
  ensureAuthenticated,
  ensureAdmin,
  listEventsInMonthController.handle
);

eventsRoutes.get(
  "/monthly",
  ensureAuthenticated,
  ensureAdmin,
  listEventsMonthlyController.handle
);

eventsRoutes.get(
  "/find/:id",
  ensureAuthenticated,
  ensureAdmin,
  findEventController.handle
);

eventsRoutes.post(
  "/update/:id",
  ensureAuthenticated,
  ensureAdmin,
  updateEvent.handle
);

eventsRoutes.get(
  "/day",
  ensureAuthenticated,
  ensureAdmin,
  listEventsInDay.handle
)

eventsRoutes.get(
  "/registered",
  ensureAuthenticated,
  listUserEventsRegisteredController.handle
);

eventsRoutes.get(
  "/waiting",
  ensureAuthenticated,
  listUserEventsWaitingListController.handle
);

eventsRoutes.get(
  "/valid/delete",
  ensureAuthenticated,
  ensureAdmin,
  canDeleteEventController.handle
)

eventsRoutes.post(
  "/canceled/:id",
  ensureAuthenticated,
  ensureAdmin,
  cancelEventController.handle
)

eventsRoutes.post(
  "/activated/:id",
  ensureAuthenticated,
  ensureAdmin,
  canceledEventController.handle
)

eventsRoutes.get(
  "/teacher",
  ensureAuthenticated,
  ensureAdmin,
  listEventsByTeacherController.handle
)

export { eventsRoutes };
