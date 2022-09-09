interface IDateProvider {
  differenceInHours(start_date: Date, end_date: Date): number;
  convertToUTC(date: Date | string): string;
  dateNow(date?: Date | string | number): Date;
  compareInDays(start_date: Date, end_date: Date): number;
  addDays(days: number): Date;
  addHours(hours: number): Date;
  comparaIfBefore(start_date: Date, end_date: Date): boolean;
  parseISO(date: Date | string): Date;
  parseFormat(date: Date | string, format?: string): string;
  parseFormatUTC(date: Date, format?: string): string;
  formatInDate(date: Date): string;
  formatInHour(date: Date): string;
  addHoursInDate(date: Date, hours: number): Date;
  addDaysInDate(date: Date, days: number): Date;
  differenceInMinutes(start_date: Date | string, end_date: Date | string): number;
  addMinutesInDate(date: Date, minutes: number): Date;
  getDay(date: Date): number;
  getMonth(date: Date): number;
  getYear(date: Date): number;
}

export { IDateProvider };
