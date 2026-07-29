import { google } from 'googleapis';

export interface CalendarEventData {
  summary: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  attendees?: { email: string; displayName?: string }[];
}

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function getAuthClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !key) {
    throw new Error('Google service account credentials not configured');
  }

  return new google.auth.JWT({
    email,
    key: key.replace(/\\n/g, '\n'),
    scopes: SCOPES,
  });
}

export async function createCalendarEvent(eventData: CalendarEventData) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    throw new Error('GOOGLE_CALENDAR_ID not configured');
  }

  const auth = getAuthClient();
  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary: eventData.summary,
    description: eventData.description,
    location: eventData.location,
    start: {
      dateTime: eventData.startDateTime,
      timeZone: 'Africa/Lagos',
    },
    end: {
      dateTime: eventData.endDateTime,
      timeZone: 'Africa/Lagos',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 30 },
        { method: 'popup', minutes: 10 },
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId,
    requestBody: event,
  });

  return response.data;
}

export function buildEventDescription(booking: {
  name: string;
  phone: string;
  email: string;
  service_type: string;
  sub_category: { name: string }[];
  additional_notes?: string;
}): string {
  const subServices = booking.sub_category.map((s) => s.name).join(', ');

  return [
    `Client: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    '',
    `Service: ${booking.service_type}`,
    `Treatments: ${subServices}`,
    '',
    `Notes: ${booking.additional_notes || 'None'}`,
  ].join('\n');
}
