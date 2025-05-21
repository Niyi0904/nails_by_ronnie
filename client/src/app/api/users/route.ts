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
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote', details: error.message },
      { status: 500 }
    );
  }
}