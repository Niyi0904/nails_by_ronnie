import { NextResponse } from 'next/server';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';

    const response = await fetch(`${SERVER_URL}/api/auth/current-user`, {
      headers: { cookie },
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Auth/CurrentUser] ${message}`);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
