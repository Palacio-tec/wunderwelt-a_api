import { ScheduledTask } from "node-cron";

import EventsWillStart from "./jobs/EventsWillStart";
import EventsWithoutStudent from "./jobs/EventsWithoutStudent";
import EventsCanRefound from "./jobs/EventsCanRefound";
import EventsReminder from "./jobs/EventsReminder";
import EventsNewsletter from "./jobs/EventsNewsletter"
import PreviewEventsWillStart from "./jobs/PreviewEventsWillStart";
import CreditsWillExpired from "./jobs/CreditsWillExpired";
import UpdateUserCredits from "./jobs/UpdateUserCredits"

const { ENVIRONMENT, LOCAL_JOBS } = process.env

const cronJobs = {
  eventsWillStart: EventsWillStart,
  eventsWithoutStudent: EventsWithoutStudent,
  eventsCanRefound: EventsCanRefound,
  eventsReminder: EventsReminder,
  eventsNewsletter: EventsNewsletter,
  previewEventsWillStart: PreviewEventsWillStart,
  creditsWillExpired: CreditsWillExpired,
  updateUserCredits: UpdateUserCredits,
};

const localJobs = LOCAL_JOBS.split(',')

const localCronJobs = localJobs 
  ? localJobs.map(job => cronJobs[job]) as unknown as ScheduledTask[]
  : []

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
      : localCronJobs;
  };

  run() {
    console.log(`[CronJobs] ${localJobs}`)
    if (LOCAL_JOBS) {
      this.jobs.forEach(job => job.start());
    }
  }
}

export default new ManagerCron();
