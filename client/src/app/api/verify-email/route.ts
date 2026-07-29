import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is missing" }, { status: 400 });
    }

    const response = await fetch(`http://localhost:3030/api/auth/verify-email?token=${token}`);

    if (!response.ok) {
      return NextResponse.json({ error: "Verification link is invalid or expired.", status: false }, { status: response.status });
    }

    return NextResponse.json({ message: "Email verified successfully", status: true });
  } catch (error) {
    console.error(`[VerifyEmail] ${error.message}`, error.stack);
    return NextResponse.json({ error: "Something went wrong. Please try again later.", status: false  }, { status: 500 });
  }
}
