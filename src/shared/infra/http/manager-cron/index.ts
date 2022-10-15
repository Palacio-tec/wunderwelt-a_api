import { ScheduledTask } from "node-cron";

import EventsWillStart from "./jobs/EventsWillStart";
import EventsWithoutStudent from "./jobs/EventsWithoutStudent";
import EventsCanRefound from "./jobs/EventsCanRefound";
import EventsReminder from "./jobs/EventsReminder";
import EventsNewsletter from "./jobs/EventsNewsletter"
import PreviewEventsWillStart from "./jobs/PreviewEventsWillStart";
import CreditsWillExpired from "./jobs/CreditsWillExpired";
import UpdateUserCredits from "./jobs/UpdateUserCredits"

const { ENVIRONMENT } = process.env

class ManagerCron{
  private jobs: ScheduledTask[];

  constructor() {
    this.jobs = ENVIRONMENT === 'production'
      ? [
        EventsReminder,
        EventsWillStart,
        EventsWithoutStudent,
        EventsCanRefound,
        EventsNewsletter,
        PreviewEventsWillStart,
        CreditsWillExpired,
        UpdateUserCredits,
      ]
      : [];
  };

  run() {
    
    this.jobs.forEach(job => job.start());
  }
}

export default new ManagerCron();
