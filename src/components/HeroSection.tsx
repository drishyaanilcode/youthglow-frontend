import { ArrowRight, Sparkles, Calendar } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-light/20 rounded-full blur-3xl animate-float delay-300" />
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-rose-100/40 rounded-full blur-2xl animate-float delay-500" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-44 sm:pt-48 pb-16 sm:pb-20">
        <div className="flex items-center min-h-[calc(100vh-14rem)]">
          {/* ====== LEFT — Text Content ====== */}
          <div className="animate-fade-in-up w-full lg:w-1/2 lg:pr-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-brand-light/50 mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 text-brand" />
              <span className="text-sm font-medium text-brand-dark">
                New Collection 2026
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="block text-slate-900">Radiance is</span>
              <span className="block gradient-text">Your Ritual</span>
            </h1>

            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
              Luxury skincare and makeup crafted for the modern woman. Discover
              formulas that transform, protect, and elevate your natural glow.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/book"
                className="btn-shine btn-glow inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-dark transition-all duration-300 shadow-xl shadow-brand/30 hover:shadow-2xl hover:shadow-brand/40 hover:scale-105"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </Link>
              <Link
                href="/shop"
                className="btn-shine inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 hover:scale-105"
              >
                Shop Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 sm:mt-12 flex gap-6 sm:gap-12">
              <div className="animate-fade-in-up delay-200">
                <p
                  className="text-2xl sm:text-3xl font-bold text-slate-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  50K+
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Happy Clients
                </p>
              </div>
              <div className="animate-fade-in-up delay-300">
                <p
                  className="text-2xl sm:text-3xl font-bold text-slate-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  200+
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Premium Products
                </p>
              </div>
              <div className="animate-fade-in-up delay-400">
                <p
                  className="text-2xl sm:text-3xl font-bold text-slate-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  4.9★
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Average Rating
                </p>
              </div>
            </div>
          </div>

          {/* ====== RIGHT — Hero Image (desktop only, fixed to right side) ====== */}
          <div className="hidden lg:block w-1/2 relative animate-fade-in-up delay-200">
            <div className="relative">
              {/* Main image */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand/20 animate-pulse-glow">
                <img
                  src="/images/hero.jpeg"
                  alt="Young Glow — Luxury Beauty"
                  className="w-full h-[580px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 via-transparent to-rose-200/10" />
              </div>

              {/* Floating product card */}
              <div className="absolute -left-8 bottom-20 bg-white rounded-2xl p-4 shadow-xl animate-float delay-200 max-w-[200px]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🌸</span>
                  <div>
                    <p className="text-xs text-slate-500">Best Seller</p>
                    <p className="text-sm font-semibold text-slate-900">
                      Rose Glow Serum
                    </p>
                    <p className="text-xs text-brand font-bold">AED 189</p>
                  </div>
                </div>
              </div>

              {/* Rating badge */}
              <div className="absolute -right-4 top-20 bg-white rounded-2xl p-4 shadow-xl animate-float delay-400">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">4.9</p>
                  <p className="text-yellow-400 text-sm">★★★★★</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    2.4K Reviews
                  </p>
                </div>
              </div>

              {/* Dermatologist Approved badge */}
              <div className="absolute -right-6 bottom-16 bg-white rounded-2xl px-4 py-3 shadow-xl animate-float delay-600 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">
                  ✓
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Dermatologist
                  </p>
                  <p className="text-[10px] text-slate-500">Approved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
