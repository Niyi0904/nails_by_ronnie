import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:3030/api/users/getAllUser');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch external API: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      message: 'Quote fetched successfully',
      data,
    });
  } catch (error: any) {
    console.error(`[Users API] ${error.message}`, error.stack);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}