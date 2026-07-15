import { Metadata } from "next";
import { db } from "@/db";
import { serviceCategories, services, packagePlans, branches } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingFlow from "./BookingFlow";

export const metadata: Metadata = {
  title: "Book Session — Young Glow | Beauty Treatments Dubai",
  description: "Book your beauty treatment session with our certified specialists in Dubai, UAE.",
};

export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const typeParam = params.type === "single" || params.type === "package" ? params.type : null;

  const cats = await db.select().from(serviceCategories).orderBy(asc(serviceCategories.displayOrder));
  const categoriesWithServices = [];
  for (const cat of cats) {
    const catServices = await db.select().from(services).where(eq(services.categoryId, cat.id));
    if (catServices.length > 0) {
      categoriesWithServices.push({
        id: cat.id, name: cat.name, slug: cat.slug, emoji: cat.emoji, image: cat.image, description: cat.description,
        services: catServices.map(s => ({ id: s.id, name: s.name, description: s.description, durationMinutes: s.durationMinutes, price: s.price, emoji: s.emoji, image: s.image })),
      });
    }
  }

  const plans = await db.select().from(packagePlans).orderBy(asc(packagePlans.durationMonths));
  const allBranches = await db.select().from(branches);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <BookingFlow
        categories={categoriesWithServices}
        packagePlans={plans.map(p => ({ id: p.id, name: p.name, durationMonths: p.durationMonths, sessionsIncluded: p.sessionsIncluded, discountPercent: p.discountPercent, description: p.description, badge: p.badge }))}
        branches={allBranches.map(b => ({ id: b.id, name: b.name, address: b.address, mapUrl: b.mapUrl, phone: b.phone }))}
        initialType={typeParam}
      />
      <Footer />
    </main>
  );
}
