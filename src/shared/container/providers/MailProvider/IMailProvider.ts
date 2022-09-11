import { ICalCalendar } from "ical-generator";

interface IMailProviderProps {
  to: string,
  subject: string,
  variables: any,
  path: string,
  calendarEvent?: {
    content: ICalCalendar | null,
    method: string | undefined
  }
}

interface IMailProvider {
  sendMail({
    to,
    subject,
    variables,
    path,
    calendarEvent,
  }: IMailProviderProps): Promise<void>;
}

export { IMailProvider, IMailProviderProps };
