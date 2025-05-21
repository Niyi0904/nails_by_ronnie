import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {

    const response = await fetch('http://localhost:3030/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), // No extra nesting
    });

    if (!response.ok) {
        console.error("🚫 Signup failed with status", response.statusText);
        console.log(JSON.stringify(body));
        console.error("🪵 Server returned:");
        return NextResponse.json({ error:response.status === 409 ? 'Email or phone number already in use.' : 'Failed to create user' }, { status: response.status });
      }

    const data = await response.json();
    return NextResponse.json({ message: 'User created successfully', data });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
