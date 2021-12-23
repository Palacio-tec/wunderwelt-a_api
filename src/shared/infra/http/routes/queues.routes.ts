import { Router } from "express";

import { CreateQueueController } from "@modules/queues/useCases/createQueue/CreateQueueController";
import { ListQueuesController } from "@modules/queues/useCases/listQueues/ListQueuesController";
import { ListAvailableQueuesController } from "@modules/queues/useCases/listAvailableQueues/ListAvailableQueuesController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const queueRoutes = Router();

const createQueueController = new CreateQueueController();
const listQueuesController = new ListQueuesController();
const listAvailableQueuesController = new ListAvailableQueuesController();

queueRoutes.post("/:id", ensureAuthenticated, createQueueController.handle);

queueRoutes.get("/", ensureAuthenticated, listQueuesController.handle);

queueRoutes.get("/list-available", ensureAuthenticated, listAvailableQueuesController.handle);

export { queueRoutes };
