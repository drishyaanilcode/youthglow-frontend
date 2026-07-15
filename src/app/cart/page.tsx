import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartContent from "./CartContent";

export const metadata: Metadata = {
  title: "Your Bag — Young Glow",
  description: "Review your selected products and booked sessions.",
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your Bag
          </h1>
          <p className="text-slate-500 text-center mb-10">
            Products for delivery & booked sessions
          </p>
          <CartContent />
        </div>
      </div>
      <Footer />
    </main>
  );
}
