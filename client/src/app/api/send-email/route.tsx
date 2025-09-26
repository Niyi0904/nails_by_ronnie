// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from "@react-email/render";
import BookingConfirmation from '@/components/react-email'; // ✅ fixed import

const allowedOrigins = [
  'https://nails-by-ronnie.vercel.app',
  'http://localhost:3000',
  'https://niyi-owoyemi-niyi0904s-projects.vercel.app/',
  'https://niyi-owoyemi-3ch3zv6g0-niyi0904s-projects.vercel.app/',
  undefined
];

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', allowedOrigins.join(','));
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  try {

    // ✅ no await needed
    const html = await render(<BookingConfirmation name={name} />);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: 'owoyeminiyi2@gmail.com',
        pass: 'aogv orqv gmkd hujf',
      },
    });

    const info = await transporter.sendMail({
      from: `"NidavTech Contact Form" <owoyeminiyi2@gmail.com>`,
      replyTo: 'owoyeminiyi2@gmail.com',
      to: 'owoyeminiyi2@gmail.com',
      subject: `New message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: html as string ,
    });

    console.log(info.messageId)

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
