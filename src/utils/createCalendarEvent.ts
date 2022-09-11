import
    ical,
    { 
        ICalAttendeeRole, 
        ICalAttendeeStatus, 
        ICalCalendar, 
        ICalCalendarMethod, 
        ICalDateTimeValue, 
        ICalEventStatus, 
        ICalEventTransparency
    }
from "ical-generator";

interface ICreateCalendarEventProps {
    id: string,
    start: ICalDateTimeValue,
    end: ICalDateTimeValue,
    summary: string,
    description?: string,
    location?: string,
    status: string,
    method: string,
    attendee: {
        name: string,
        email: string
    }
}

const SCALE = 'gregorian'

const EVENT_VARIABLES = {
    TIMEZONE: 'America/Sao_Paulo',
    URL: 'praktika.wunderwelt-a.com.br',
    ORGANIZER_NAME: 'PrAktikA',
    ORGANIZER_EMAIL: 'info@wunderwelt-a.com.br',
}

async function createCalendarEvent({
    id,
    start,
    end,
    summary,
    description,
    location,
    status,
    method,
    attendee
}: ICreateCalendarEventProps): Promise<ICalCalendar> {
    const calendar = ical({
        method: ICalCalendarMethod[method],
        scale: SCALE,
    });

    calendar.createEvent({
        id,
        start,
        end,
        timezone: EVENT_VARIABLES.TIMEZONE,
        summary,
        description,
        location,
        url: EVENT_VARIABLES.URL,
        attendees: [
            {
                name: attendee.name,
                email: attendee.email,
                role: ICalAttendeeRole.REQ,
                status: ICalAttendeeStatus.NEEDSACTION,
                rsvp: true,
            }
        ],
        organizer: {
            name: EVENT_VARIABLES.ORGANIZER_NAME,
            email: EVENT_VARIABLES.ORGANIZER_EMAIL
        },
        status: ICalEventStatus[status],
        lastModified: new Date(),
        transparency: ICalEventTransparency.OPAQUE
    });

    return calendar;
}

export { createCalendarEvent }
