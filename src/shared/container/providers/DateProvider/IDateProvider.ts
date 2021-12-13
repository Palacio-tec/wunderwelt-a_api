interface IDateProvider {
  differenceInHours(start_date: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
  compareInDays(start_date: Date, end_date: Date): number;
  addDays(days: number): Date;
  addHours(hours: number): Date;
  comparaIfBefore(start_date: Date, end_date: Date): boolean;
  parseISO(date: Date): Date;
  parseFormat(date: Date): string;
  formatInDate(date: Date): string;
  formatInHour(date: Date): string;
  addHoursInDate(date: Date, hours: number): Date;
  addDaysInDate(date: Date, days: number): Date;
}

export { IDateProvider };
