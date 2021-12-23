import { schedule, ScheduledTask } from "node-cron";

import EventsWillStart from "./jobs/EventsWillStart";
import EventsWithoutStudent from "./jobs/EventsWithoutStudent";
import EventsCanRefound from "./jobs/EventsCanRefound";
import EventsReminder from "./jobs/EventsReminder";

// async function CronList() {
//   schedule("0 30 * * * *", () => EventsWillStart()); // Every minute 30

//   schedule("0 55 * * * *", () => EventsWithoutStudent()); // Every minute 55

//   schedule("0 56 * * * *", () => EventsCanRefound()); // Every minute 56

//   schedule("0 57 * * * *", () => EventsReminder()); // Every minute 57
// }


class ManagerCron{
  private jobs: ScheduledTask[];

  constructor() {
    this.jobs = [
      EventsReminder,
      EventsWillStart,
      EventsWithoutStudent,
      EventsCanRefound,
    ];
  };

  run() {
    this.jobs.forEach(job => job.start());
  }
}

export default new ManagerCron();
