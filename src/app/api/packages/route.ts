import { NextResponse } from "next/server";
import { db } from "@/db";
import { packagePlans } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const plans = await db
    .select()
    .from(packagePlans)
    .orderBy(asc(packagePlans.durationMonths));

  return NextResponse.json({ plans });
}
