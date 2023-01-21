import { Router } from "express";

import { authenticateRoutes } from "./authenticate.routes";
import { couponsRoutes } from "./coupons.routes";
import { eventsRoutes } from "./events.routes";
import { parametersRoutes } from "./parameters.routes";
import { passwordRoutes } from "./password.routes";
import { profileRoutes } from "./profile.routes";
import { queueRoutes } from "./queues.routes";
import { schedulesRoutes } from "./schedules.routes";
import { statementsRoutes } from "./statements.routes";
import { usersRoutes } from "./users.routes";
import { levelsRoutes } from "./levels.routes";
import { productsRoutes } from "./products.routes";
import { purchasesRoutes } from "./purchases.routes";
import { creditsRoutes } from "./credits.routes";
import { promotionsRoutes } from "./promotions.routes";
import { configurationsRoutes } from "./configurations.routes";
import { fqasRoutes } from "./fqas.routes";
import { mailLogsRoutes } from "./mailLogs.routes";

const router = Router();

router.use(authenticateRoutes);

router.use("/users", usersRoutes);
router.use("/profile", profileRoutes);
router.use("/events", eventsRoutes);
router.use("/schedules", schedulesRoutes);
router.use("/password", passwordRoutes);
router.use("/parameters", parametersRoutes);
router.use("/queues", queueRoutes);
router.use("/statements", statementsRoutes);
router.use("/coupons", couponsRoutes);
router.use("/levels", levelsRoutes);
router.use("/products", productsRoutes);
router.use("/purchase-orders", purchasesRoutes);
router.use("/credits", creditsRoutes);
router.use("/promotions", promotionsRoutes);
router.use("/configurations", configurationsRoutes);
router.use("/fqas", fqasRoutes)
router.use("/mail-logs", mailLogsRoutes)

export { router };
