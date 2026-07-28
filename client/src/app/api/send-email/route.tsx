import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from "@react-email/render";
import BookingConfirmation from '@/components/react-email';

export async function POST(request: Request) {
  // Check origin for CORS (Simple version)
  const origin = request.headers.get('origin');
  
  try {
    const { name, email, message } = await request.json();

    // Generate the HTML from your react-email component
    const emailHtml = await render(<BookingConfirmation name={name} />);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Changed from 465
      secure: false, // Use TLS
      auth: {
        user: 'ronkeowoyemi@gmail.com',
        pass: 'bndu ygkr liui toye', // Ensure this is a valid App Password
      },
      tls: {
        // This helps if you are on a network that has strict handshake rules
        rejectUnauthorized: false 
      }
    });

    const info = await transporter.sendMail({
      from: `"Nails by Ronnie" <ronkeowoyemi@gmail.com>`,
      to: 'owoyeminiyi2@gmail.com, ronkeowoyemi@gmail.com',
      subject: `New message from ${name}`,
      text: message, // Plain text fallback
      html: emailHtml,
    });

    console.log("Email sent: ", info.messageId);

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { 
        status: 200,
        headers: { 'Access-Control-Allow-Origin': origin || '*' } 
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

// Fix OPTIONS to handle CORS properly
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}