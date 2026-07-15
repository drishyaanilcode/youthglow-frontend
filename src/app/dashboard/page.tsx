import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardContent from "./DashboardContent";

export const metadata: Metadata = {
  title: "My Dashboard — Young Glow",
  description: "View your upcoming bookings, active packages, and booking history.",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            My Dashboard
          </h1>
          <p className="text-slate-500 mb-10">Your bookings, packages & history</p>
          <DashboardContent />
        </div>
      </div>
      <Footer />
    </main>
  );
}
