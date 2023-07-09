import { schedule } from "node-cron";

import { UpdateUsersHoursController } from "@modules/accounts/useCases/updateUsersHours/UpdateUsersHoursController";

function UpdateUsersHours() {
  const updateUsersHoursController = new UpdateUsersHoursController();

  updateUsersHoursController.handle();
}

export default schedule(
  process.env.UPDATE_USER_CREDITS || "0 0 3 * * *", // Every 3 o`clock
  UpdateUsersHours,
  { scheduled: false }
);
