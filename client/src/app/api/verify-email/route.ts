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
      return NextResponse.json({ error: "Email verification failed", status: false }, { status: response.status });
    }

    return NextResponse.json({ message: "Email verified successfully", status: true });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Internal Server Error", status: false  }, { status: 500 });
  }
}
