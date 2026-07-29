import { NextResponse } from 'next/server';
import { createCalendarEvent, buildEventDescription } from '@/lib/googleCalendar';

function parseBookingTime(bookingDate: string, bookingTime: string): { start: Date; end: Date } {
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

  const start = new Date(bookingDate);
  start.setHours(hours, minutes, 0, 0);

  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  return { start, end };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, service_type, sub_category, booking_date, booking_time, booking_location, additional_notes } = body;

    if (!booking_date || !booking_time || !name || !service_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { start, end } = parseBookingTime(booking_date, booking_time);

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
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString(),
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Calendar] ${message}`);
    return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 });
  }
}
