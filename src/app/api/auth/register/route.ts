import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, password } = body;

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check existing
    const existing = await db
      .select({ id: patients.id })
      .from(patients)
      .where(eq(patients.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please login." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await db
      .insert(patients)
      .values({
        fullName,
        email: email.toLowerCase(),
        phone,
        passwordHash,
      })
      .returning({
        id: patients.id,
        fullName: patients.fullName,
        email: patients.email,
        phone: patients.phone,
      });

    const user = result[0];
    const token = await createSession(user);
    await setSessionCookie(token);

    return NextResponse.json(
      {
        message: "Account created successfully! Welcome to Young Glow 🌸",
        user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
