import { db } from "@/db";
import { products, testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import DoctorsSection from "@/components/DoctorsSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandShowcase from "@/components/BrandShowcase";
import WhySection from "@/components/WhySection";
import BookAppointmentSection from "@/components/BookAppointmentSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await db
    .select()
    .from(products)
    .where(eq(products.featured, true))
    .limit(4);

  const allTestimonials = await db.select().from(testimonials).limit(6);

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <MarqueeBanner />
      <DoctorsSection />
      <CategoriesSection />
      <FeaturedProducts products={featuredProducts} />
      <BrandShowcase />
      <WhySection />
      <BookAppointmentSection />
      <TestimonialsSection testimonials={allTestimonials} />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
