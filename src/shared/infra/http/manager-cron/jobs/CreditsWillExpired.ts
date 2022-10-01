import { schedule } from "node-cron";

import { ListWillExpiredHoursController } from "@modules/accounts/useCases/listWillExpiredHours/ListWillExpiredHoursController";

function CreditsWillExpired() {
  const listWillExpiredHoursController = new ListWillExpiredHoursController();

  const date = new Date();

  listWillExpiredHoursController.handle(date);
}

export default schedule('0 0 10 * * *', CreditsWillExpired, { scheduled: false }); // Every 10 o'clock