import { ScheduledTask } from "node-cron";

import EventsWillStart from "./jobs/EventsWillStart";
import EventsWithoutStudent from "./jobs/EventsWithoutStudent";
import EventsCanRefound from "./jobs/EventsCanRefound";
import EventsReminder from "./jobs/EventsReminder";
import EventsNewsletter from "./jobs/EventsNewsletter"

class ManagerCron{
  private jobs: ScheduledTask[];

  constructor() {
    this.jobs = [
      EventsReminder,
      EventsWillStart,
      EventsWithoutStudent,
      EventsCanRefound,
      EventsNewsletter,
    ];
  };

  run() {
    this.jobs.forEach(job => job.start());
  }
}

export default new ManagerCron();
