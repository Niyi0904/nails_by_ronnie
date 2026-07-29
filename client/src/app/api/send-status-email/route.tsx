import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from "@react-email/render";
import BookingConfirmed from '@/components/react-email/booking-confirmed';
import BookingCompleted from '@/components/react-email/booking-completed';
import { generateICS } from '@/lib/generateICS';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'ronkeowoyemi@gmail.com',
    pass: 'bndu ygkr liui toye',
  },
  tls: { rejectUnauthorized: false },
});

export async function POST(request: Request) {
  try {
    const { status, name, email, service_type, booking_date, booking_time, booking_location, sub_category, phone, additional_notes } = await request.json();

    if (!email || !status || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let subject: string;
    let emailHtml: string;

    if (status === 'confirmed') {
      subject = `Your ${service_type} appointment is confirmed!`;
      emailHtml = await render(
        <BookingConfirmed
          name={name}
          service_type={service_type}
          booking_date={booking_date}
          booking_time={booking_time}
          booking_location={booking_location}
        />
      );
    } else if (status === 'completed') {
      subject = `Thanks for visiting Nails by Ronnie!`;
      emailHtml = await render(
        <BookingCompleted
          name={name}
          service_type={service_type}
        />
      );
    } else {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const icsContent = generateICS({
      name, email, phone: phone || '', service_type,
      sub_category: sub_category || [],
      booking_date, booking_time,
      booking_location: booking_location || '',
      additional_notes,
    });

    await transporter.sendMail({
      from: `"Nails by Ronnie" <ronkeowoyemi@gmail.com>`,
      to: email,
      subject,
      html: emailHtml,
      attachments: [{
        filename: 'appointment.ics',
        content: icsContent,
        contentType: 'text/calendar',
      }],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[SendStatusEmail] ${message}`);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
