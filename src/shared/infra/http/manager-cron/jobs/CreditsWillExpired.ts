import { schedule } from "node-cron";

import { ListWillExpiredHoursController } from "@modules/accounts/useCases/listWillExpiredHours/ListWillExpiredHoursController";

function CreditsWillExpired() {
  const listWillExpiredHoursController = new ListWillExpiredHoursController();

  const date = new Date();

  listWillExpiredHoursController.handle(date, 60);

  listWillExpiredHoursController.handle(date, 30);
}

export default schedule('0 0 10 * * *', CreditsWillExpired, { scheduled: false }); // Every 10 o'clock