import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  differenceInHours(start_date: Date, end_date: Date): number {
    const start_date_utc = this.convertToUTC(start_date);
    const end_date_utc = this.convertToUTC(end_date);

    return dayjs(end_date_utc).diff(start_date_utc, "hours");
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  dateNow(): Date {
    return dayjs().toDate();
  }

  compareInDays(start_date: Date, end_date: Date): number {
    const start_date_utc = this.convertToUTC(start_date);
    const end_date_utc = this.convertToUTC(end_date);

    return dayjs(end_date_utc).diff(start_date_utc, "days");
  }

  addDays(days: number): Date {
    return dayjs().add(days, "days").toDate();
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, "hours").toDate();
  }

  comparaIfBefore(start_date: Date, end_date: Date): boolean {
    return dayjs(start_date).isBefore(end_date);
  }

  parseISO(date: Date): Date {
    const parseDate = dayjs(date).toISOString();
    return dayjs(parseDate).toDate();
  }

  parseFormat(date: Date, format: string = "YYYY-MM-DD HH:mm:ss"): string {
    return dayjs(date).format(format);
  }

  formatInDate(date: Date): string {
    return dayjs(date).format("DD-MM-YYYY");
  }

  formatInHour(date: Date): string {
    return dayjs(date).format("HH:mm");
  }

  addHoursInDate(date: Date, hours: number): Date {
    return dayjs(date).add(hours, "hours").toDate();
  }

  addDaysInDate(date: Date, days: number): Date {
    return dayjs(date).add(days, "days").toDate();
  }
}

export { DayjsDateProvider };
