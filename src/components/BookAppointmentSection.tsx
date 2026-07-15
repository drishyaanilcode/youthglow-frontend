"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Sparkles, ArrowRight, Star, Shield, Award, Package, Zap } from "lucide-react";
import { useAuth } from "./AuthProvider";

const popularServices = [
  { emoji: "✨", title: "Signature Facials", description: "Luxury facial treatments with gold & rose extracts" },
  { emoji: "💉", title: "Wrinkle Reduction", description: "Botox & anti-aging treatments by specialists" },
  { emoji: "💧", title: "Filler Treatments", description: "Lip, cheek & jawline contouring" },
  { emoji: "💎", title: "Skin Boosters", description: "Deep hydration & glow treatments" },
];

export default function BookAppointmentSection() {
  const { user, requireAuth } = useAuth();
  const router = useRouter();

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (requireAuth()) {
      router.push("/book");
    }
  };

  return (
    <section id="book-appointment" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-brand/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-float delay-300" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6">
            <Calendar className="w-4 h-4 text-brand-light" />
            <span className="text-sm text-brand-light font-semibold">Premium Beauty Sessions</span>
          </div>

          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Book Your
            <span className="block mt-2 gradient-text">Glow Session</span>
          </h2>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience luxury treatments by certified dermatologists. Choose single sessions or save with packages.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-4 h-4 text-brand-light" />
              <span className="text-sm">Licensed Specialists</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Star className="w-4 h-4 text-brand-light" />
              <span className="text-sm">4.9★ Rated on Google</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Award className="w-4 h-4 text-brand-light" />
              <span className="text-sm">5000+ Treatments Done</span>
            </div>
          </div>
        </div>

        {/* Two Options: Single vs Package */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          <Link
            href={user ? "/book?type=single" : "#"}
            onClick={!user ? handleBookClick : undefined}
            className="group relative rounded-3xl bg-white/[0.07] backdrop-blur-sm border border-white/10 p-8 hover:bg-white/[0.12] hover:border-brand-light/30 transition-all cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-400/20 flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Single Session
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Book individual treatments. Perfect for trying new services or occasional visits.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-light group-hover:gap-2 transition-all">
              Book Now <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href={user ? "/book?type=package" : "#"}
            onClick={!user ? handleBookClick : undefined}
            className="group relative rounded-3xl bg-white/[0.07] backdrop-blur-sm border border-white/10 p-8 hover:bg-white/[0.12] hover:border-brand-light/30 transition-all cursor-pointer"
          >
            <span className="absolute -top-3 right-4 px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              Save up to 25%
            </span>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400/20 to-purple-400/20 flex items-center justify-center mb-4">
              <Package className="w-7 h-7 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Package Plans
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              1, 2, 3, 6, or 12-month plans. Multiple sessions at discounted rates for best results.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-light group-hover:gap-2 transition-all">
              View Plans <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {/* Popular Services Preview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {popularServices.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl bg-white/[0.05] border border-white/5 p-5 hover:bg-white/[0.08] transition-all"
            >
              <span className="text-3xl block mb-3">{s.emoji}</span>
              <h4 className="text-sm font-bold text-white mb-1">{s.title}</h4>
              <p className="text-xs text-slate-500">{s.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block rounded-full p-[3px] sparkle-border">
            <button
              onClick={handleBookClick}
              className="relative btn-shine inline-flex items-center gap-3 px-12 sm:px-16 py-5 sm:py-6 bg-slate-900 text-white rounded-full text-lg sm:text-xl font-bold hover:bg-slate-800 transition-all duration-300 group"
            >
              <Calendar className="w-6 h-6 text-brand-light group-hover:scale-110 transition-transform" />
              <span>Book Your Session Now</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-5">
            ⚡ 29 service categories · 5 package plans · Free consultation available
          </p>
        </div>
      </div>
    </section>
  );
}
