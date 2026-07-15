import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sessionBookings, patientPackages, packagePlans } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Please login." }, { status: 401 });

    const body = await request.json();
    const { type, serviceId, packagePlanId, branchId, sessionDate, sessionTime, paymentMethod, healthScreening } = body;

    if (!serviceId || !branchId || !sessionDate || !sessionTime) {
      return NextResponse.json({ error: "Please complete all steps." }, { status: 400 });
    }

    const doctors = ["Dr. Amira Al Mansoori","Dr. Khalid Rashid","Dr. Fatima Hassan","Dr. Sara Al Hashimi"];
    const assignedDoctor = doctors[Math.floor(Math.random() * doctors.length)];

    let patientPackageId: number | null = null;

    if (type === "package" && packagePlanId) {
      // Create patient package
      const [plan] = await db.select().from(packagePlans).where(eq(packagePlans.id, packagePlanId)).limit(1);
      if (plan) {
        const startDate = new Date(sessionDate);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plan.durationMonths);

        const [pkg] = await db.insert(patientPackages).values({
          patientId: user.id,
          packagePlanId: plan.id,
          sessionsUsed: 1,
          sessionsTotal: plan.sessionsIncluded,
          startDate: sessionDate,
          endDate: endDate.toISOString().split("T")[0],
          paymentMethod: paymentMethod || "reception",
          status: "active",
        }).returning({ id: patientPackages.id });
        patientPackageId = pkg.id;
      }
    }

    const [booking] = await db.insert(sessionBookings).values({
      patientId: user.id,
      serviceId,
      patientPackageId,
      branchId,
      doctorName: assignedDoctor,
      sessionDate,
      sessionTime,
      paymentMethod: paymentMethod || "reception",
      status: "confirmed",
      healthScreening: healthScreening || null,
    }).returning({ id: sessionBookings.id });

    return NextResponse.json({
      message: `Booking confirmed! ${assignedDoctor} will see you. 🌸`,
      bookingId: booking.id,
    }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
