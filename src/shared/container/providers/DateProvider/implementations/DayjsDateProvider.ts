import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);
dayjs.extend(timezone);

class DayjsDateProvider implements IDateProvider {
  differenceInHours(start_date: Date, end_date: Date): number {
    const start_date_utc = this.convertToUTC(start_date);
    const end_date_utc = this.convertToUTC(end_date);

    return dayjs(end_date_utc).diff(start_date_utc, "hours");
  }

  convertToUTC(date: Date | string): string {
    return dayjs(date).utc().local().format();
  }

  dateNow(date?: Date | string | number): Date {
    return dayjs(date).toDate();
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
    return dayjs(date).tz('America/Sao_Paulo').format(format);
  }

  parseFormatUTC(date: Date, format: string = "YYYY-MM-DD HH:mm:ss"): string {
    return dayjs(date).format(format);
  }

  formatInDate(date: Date): string {
    return dayjs(date).tz('America/Sao_Paulo').format("DD-MM-YYYY");
  }

  formatInHour(date: Date): string {
    return dayjs(date).tz('America/Sao_Paulo').format("HH:mm");
  }

  addHoursInDate(date: Date, hours: number): Date {
    return dayjs(date).add(hours, "hours").toDate();
  }

  addDaysInDate(date: Date, days: number): Date {
    return dayjs(date).add(days, "days").toDate();
  }

  differenceInMinutes(start_date: Date | string, end_date: Date | string): number {
    const start_date_utc = this.convertToUTC(start_date);
    const end_date_utc = this.convertToUTC(end_date);

    return dayjs(end_date_utc).diff(start_date_utc, "minutes");
  }

  addMinutesInDate(date: Date, minutes: number): Date {
    return dayjs(date).add(minutes, "minutes").toDate();
  }

  getDay(date: Date): number {
    const day = dayjs(date).get('date');

    return day
  }

  getMonth(date: Date): number {
    const day = dayjs(date).get('month');

    return day
  }

  getYear(date: Date): number {
    const day = dayjs(date).get('year');

    return day
  }
}

export { DayjsDateProvider };
