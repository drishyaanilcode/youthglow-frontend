import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sessionBookings, patientPackages, packagePlans } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Please login." }, { status: 401 });

    const body = await request.json();
    const { type, serviceId, packagePlanId, usePackageId, branchId, sessionDate, sessionTime, paymentMethod, healthScreening } = body;

    if (!serviceId || !branchId || !sessionDate || !sessionTime) {
      return NextResponse.json({ error: "Please complete all steps." }, { status: 400 });
    }

    const doctors = ["Dr. Amira Al Mansoori","Dr. Khalid Rashid","Dr. Fatima Hassan","Dr. Sara Al Hashimi"];
    const assignedDoctor = doctors[Math.floor(Math.random() * doctors.length)];

    let patientPackageId: number | null = null;

    if (type === "use_package" && usePackageId) {
      const [pkg] = await db
        .select()
        .from(patientPackages)
        .where(and(eq(patientPackages.id, usePackageId), eq(patientPackages.patientId, user.id)))
        .limit(1);

      if (!pkg) return NextResponse.json({ error: "Package not found." }, { status: 404 });
      if (pkg.status !== "active") return NextResponse.json({ error: "Package inactive." }, { status: 400 });

      const bookedSessions = await db.select().from(sessionBookings)
        .where(and(eq(sessionBookings.patientPackageId, pkg.id), eq(sessionBookings.patientId, user.id)));
      const activeBookings = bookedSessions.filter(b => b.status === "booked" || b.status === "confirmed" || b.status === "completed");

      if (activeBookings.length >= pkg.sessionsTotal) {
        return NextResponse.json({ error: "No sessions remaining." }, { status: 400 });
      }

      patientPackageId = pkg.id;

      const [booking] = await db.insert(sessionBookings).values({
        patientId: user.id,
        serviceId,
        patientPackageId,
        branchId,
        doctorName: assignedDoctor,
        sessionDate,
        sessionTime,
        paymentMethod: "package",
        status: "booked",
        healthScreening: healthScreening || null,
      }).returning({ id: sessionBookings.id });

      const remaining = pkg.sessionsTotal - activeBookings.length - 1;
      return NextResponse.json({
        message: `Session booked! ${assignedDoctor}. ${remaining} session${remaining !== 1 ? "s" : ""} left. 🌸`,
        bookingId: booking.id,
      }, { status: 201 });
    }

    if (type === "package" && packagePlanId) {
      const [plan] = await db.select().from(packagePlans).where(eq(packagePlans.id, packagePlanId)).limit(1);
      if (plan) {
        const startDate = new Date(sessionDate);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plan.durationMonths);

        const [pkg] = await db.insert(patientPackages).values({
          patientId: user.id,
          packagePlanId: plan.id,
          sessionsUsed: 0,
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
      status: "booked",
      healthScreening: healthScreening || null,
    }).returning({ id: sessionBookings.id });

    return NextResponse.json({
      message: `Booking confirmed! ${assignedDoctor}. 🌸`,
      bookingId: booking.id,
    }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Please login." }, { status: 401 });

    const body = await request.json();
    const { bookingId, action } = body;

    if (!bookingId || !action) {
      return NextResponse.json({ error: "Booking ID and action required." }, { status: 400 });
    }

    const [booking] = await db.select().from(sessionBookings)
      .where(and(eq(sessionBookings.id, bookingId), eq(sessionBookings.patientId, user.id))).limit(1);

    if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

    if (action === "complete") {
      await db.update(sessionBookings).set({ status: "completed" }).where(eq(sessionBookings.id, booking.id));

      if (booking.patientPackageId) {
        const [pkg] = await db.select().from(patientPackages)
          .where(eq(patientPackages.id, booking.patientPackageId)).limit(1);
        if (pkg) {
          const newUsed = pkg.sessionsUsed + 1;
          await db.update(patientPackages)
            .set({ sessionsUsed: newUsed, status: newUsed >= pkg.sessionsTotal ? "completed" : "active" })
            .where(eq(patientPackages.id, pkg.id));
        }
      }

      return NextResponse.json({ message: "Session completed. ✅" });
    } else if (action === "cancel") {
      if (booking.status === "completed") return NextResponse.json({ error: "Cannot cancel completed." }, { status: 400 });
      await db.update(sessionBookings).set({ status: "cancelled" }).where(eq(sessionBookings.id, booking.id));
      return NextResponse.json({ message: "Booking cancelled. 🔄" });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
