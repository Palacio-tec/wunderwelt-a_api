import { Router } from "express";

import { CreateQueueController } from "@modules/queues/useCases/createQueue/CreateQueueController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ListQueuesController } from "@modules/queues/useCases/listQueues/ListQueuesController";

const queueRoutes = Router();

const createQueueController = new CreateQueueController();
const listQueuesController = new ListQueuesController();

queueRoutes.post("/:id", ensureAuthenticated, createQueueController.handle);
queueRoutes.get("/", ensureAuthenticated, listQueuesController.handle);

export { queueRoutes };
