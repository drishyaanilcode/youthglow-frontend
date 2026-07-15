import { NextResponse } from "next/server";
import { db } from "@/db";
import { sessionBookings, services, serviceCategories, branches, patientPackages, packagePlans } from "@/db/schema";
import { eq, and, gte, desc, asc } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date().toISOString().split("T")[0];

  // Get all bookings
  const bookings = await db
    .select()
    .from(sessionBookings)
    .where(eq(sessionBookings.patientId, user.id))
    .orderBy(desc(sessionBookings.sessionDate));

  const enrichedBookings = [];
  for (const b of bookings) {
    const [service] = await db.select().from(services).where(eq(services.id, b.serviceId)).limit(1);
    const [branch] = await db.select().from(branches).where(eq(branches.id, b.branchId)).limit(1);
    let categoryName = "";
    if (service) {
      const [cat] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, service.categoryId)).limit(1);
      categoryName = cat?.name || "";
    }
    enrichedBookings.push({
      id: b.id,
      serviceName: service?.name || "",
      categoryName,
      branchName: branch?.name || "",
      branchAddress: branch?.address || "",
      doctorName: b.doctorName,
      sessionDate: b.sessionDate,
      sessionTime: b.sessionTime,
      status: b.status,
      paymentMethod: b.paymentMethod,
      isUpcoming: b.sessionDate >= today,
      createdAt: b.createdAt,
    });
  }

  // Get active packages
  const packages = await db
    .select()
    .from(patientPackages)
    .where(and(eq(patientPackages.patientId, user.id), eq(patientPackages.status, "active")))
    .orderBy(asc(patientPackages.endDate));

  const enrichedPackages = [];
  for (const pkg of packages) {
    const [plan] = await db.select().from(packagePlans).where(eq(packagePlans.id, pkg.packagePlanId)).limit(1);
    // Find next upcoming booking for this package
    const nextBooking = enrichedBookings.find(b => b.isUpcoming && bookings.find(ob => ob.id === b.id && ob.patientPackageId === pkg.id));
    enrichedPackages.push({
      id: pkg.id,
      planName: plan?.name || "",
      sessionsUsed: pkg.sessionsUsed,
      sessionsTotal: pkg.sessionsTotal,
      startDate: pkg.startDate,
      endDate: pkg.endDate,
      nextSession: nextBooking ? { date: nextBooking.sessionDate, time: nextBooking.sessionTime } : null,
    });
  }

  return NextResponse.json({
    upcomingBookings: enrichedBookings.filter(b => b.isUpcoming),
    pastBookings: enrichedBookings.filter(b => !b.isUpcoming),
    activePackages: enrichedPackages,
  });
}
