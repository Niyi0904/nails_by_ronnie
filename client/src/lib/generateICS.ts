export interface ICSBooking {
  name: string;
  email: string;
  phone: string;
  service_type: string;
  sub_category: { name: string }[];
  booking_date: string;
  booking_time: string;
  booking_location: string;
  additional_notes?: string;
}

function escapeICS(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function formatICSDate(dateStr: string, timeStr: string): string {
  const time = timeStr.trim().toUpperCase();
  let hours: number;
  let minutes = 0;

  if (time.includes('AM') || time.includes('PM')) {
    const [t, modifier] = time.split(/\s+/);
    const [h, m] = t.split(':').map(Number);
    hours = h;
    minutes = m || 0;
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
  } else {
    const [h, m] = time.split(':').map(Number);
    hours = h;
    minutes = m || 0;
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const pad = (n: number) => String(n).padStart(2, '0');

  const startStr = `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}00`;

  let endHours = hours + 3;
  let endDay = day;
  if (endHours >= 24) {
    endHours -= 24;
    endDay += 1;
  }
  const endStr = `${year}${pad(month)}${pad(endDay)}T${pad(endHours)}${pad(minutes)}00`;

  return `${startStr}\r\nDTEND:${endStr}`;
}

export function generateICS(booking: ICSBooking): string {
  const subServices = booking.sub_category.map((s) => s.name).join(', ');
  const description = [
    `Service: ${booking.service_type}`,
    `Treatments: ${subServices}`,
    `Client: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    `Notes: ${booking.additional_notes || 'None'}`,
  ].join('\\n');

  const dateBlock = formatICSDate(booking.booking_date, booking.booking_time);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nails by Ronnie//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${dateBlock}`,
    `SUMMARY:${escapeICS(`Nails by Ronnie - ${booking.service_type}`)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    `LOCATION:${escapeICS(booking.booking_location || 'Studio')}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${escapeICS(booking.service_type)} at Nails by Ronnie`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
