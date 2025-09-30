import { ICalCalendar } from "ical-generator";

interface IMailProviderProps {
  to: string;
  subject: string;
  variables: any;
  path?: string;
  template?: string;
  calendarEvent?: {
    content: ICalCalendar | null;
    method: string | undefined;
  };
  bcc?: string | null;
}

interface IMailProvider {
  sendMail({
    to,
    subject,
    variables,
    path,
    template,
    calendarEvent,
    bcc,
  }: IMailProviderProps): Promise<void>;
}

export { IMailProvider, IMailProviderProps };
