import { schedule } from "node-cron";

import { UpdateUsersHoursController } from "@modules/accounts/useCases/updateUsersHours/UpdateUsersHoursController";

function UpdateUsersHours() {
  const updateUsersHoursController = new UpdateUsersHoursController();

  updateUsersHoursController.handle();
}

export default schedule('0 0 3 * * *', UpdateUsersHours, { scheduled: false }); // Every 3 o`clock
