import "reflect-metadata";

import { EventsWillStart } from "./events/EventsWillStart";

import { schedule } from "node-cron";
import { EventsWithoutStudent } from "./events/EventsWithoutStudent";
import { EventsCanRefound } from "./events/EventsCanRefound";
import { EventsReminder } from "./events/EventsReminder";

async function CronList() {
  schedule("0 30 * * * *", () => EventsWillStart()); // Every minute 30

  schedule("0 55 * * * *", () => EventsWithoutStudent()); // Every minute 55

  schedule("0 56 * * * *", () => EventsCanRefound()); // Every minute 56

  schedule("0 57 * * * *", () => EventsReminder()); // Every minute 57
}

export { CronList }