import { NextResponse } from 'next/server';
import { createCalendarEvent, buildEventDescription } from '@/lib/googleCalendar';

const SLOT_DURATION_HOURS = 3;

function parseBookingTime(bookingDate: string, bookingTime: string): { startDateTime: string; endDateTime: string } {
  const timeStr = bookingTime.trim().toUpperCase();
  let hours: number;
  let minutes = 0;

  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    const [time, modifier] = timeStr.split(/\s+/);
    const [h, m] = time.split(':').map(Number);
    hours = h;
    minutes = m || 0;
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
  } else {
    const [h, m] = timeStr.split(':').map(Number);
    hours = h;
    minutes = m || 0;
  }

  const [year, month, day] = bookingDate.split('-').map(Number);

  const pad = (n: number) => String(n).padStart(2, '0');
  const startDateTime = `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00`;

  let endHours = hours + SLOT_DURATION_HOURS;
  let endDay = day;
  if (endHours >= 24) {
    endHours -= 24;
    endDay += 1;
  }
  const endDateTime = `${year}-${pad(month)}-${pad(endDay)}T${pad(endHours)}:${pad(minutes)}:00`;

  return { startDateTime, endDateTime };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, service_type, sub_category, booking_date, booking_time, booking_location, additional_notes } = body;

    if (!booking_date || !booking_time || !name || !service_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { startDateTime, endDateTime } = parseBookingTime(booking_date, booking_time);

    const event = await createCalendarEvent({
      summary: `Nails by Ronnie - ${service_type} with ${name}`,
      description: buildEventDescription({
        name,
        phone: phone || '',
        email: email || '',
        service_type,
        sub_category: sub_category || [],
        additional_notes,
      }),
      location: booking_location || '',
      startDateTime,
      endDateTime,
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Calendar] ${message}`);
    return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 });
  }
}
