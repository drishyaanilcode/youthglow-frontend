import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(patients)
      .where(eq(patients.email, email.toLowerCase()))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "No account found with this email. Please register first." },
        { status: 401 }
      );
    }

    const patient = result[0];
    const isValid = await bcrypt.compare(password, patient.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const user = {
      id: patient.id,
      fullName: patient.fullName,
      email: patient.email,
      phone: patient.phone,
    };

    const token = await createSession(user);
    await setSessionCookie(token);

    return NextResponse.json({
      message: "Welcome back! 🌸",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
