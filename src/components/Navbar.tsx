"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  Calendar,
  User,
  LogOut,
  ChevronDown,
  Mail,
} from "lucide-react";
import { useAuth } from "./AuthProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#doctors", label: "Doctors" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=skincare", label: "Skincare" },
  { href: "/shop?category=makeup", label: "Makeup" },
  { href: "/#about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, loading, cartCount, logout, requireAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = () => setProfileOpen(false);
    if (profileOpen) {
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, [profileOpen]);

  // Handle hash scrolling — works across pages
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Only handle hash links like "/#about" or "/#doctors"
      if (!href.includes("#")) return; // let Next.js handle normal links

      e.preventDefault();
      const hash = href.split("#")[1];
      if (!hash) return;

      if (pathname === "/") {
        // Already on homepage — just scroll
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        // Navigate to homepage first, then scroll
        router.push("/#" + hash);
      }
      setMobileMenuOpen(false);
    },
    [pathname, router]
  );

  // Handle hash on page load (e.g. navigated from another page to /#about)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.slice(1);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  }, [pathname]);

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (requireAuth()) {
      router.push("/book");
    }
  };

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ══════════ EMAIL STRIP ══════════ */}
      <div className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8">
            <a
              href="mailto:info@youngglow.com"
              className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              info@youngglow.com
            </a>
            <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
              🇦🇪 Dubai, UAE · Free delivery on orders over AED 150
            </p>
            <p className="text-[11px] text-slate-400 sm:hidden">
              🇦🇪 Dubai, UAE
            </p>
          </div>
        </div>
      </div>

      {/* ══════════ TOP BAR ══════════ */}
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg"
            : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">
                ✦
              </span>
              <span
                className="text-xl font-semibold tracking-tight text-slate-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Young Glow
              </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart */}
              <button
                onClick={() => router.push("/cart")}
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-slate-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* Wishlist */}
              <button
                className="hidden sm:flex p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-slate-600" />
              </button>

              {/* Auth */}
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileOpen(!profileOpen);
                    }}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-50 border border-slate-200 hover:border-brand-light transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700 max-w-[80px] truncate hidden sm:inline">
                      {user.fullName.split(" ")[0]}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform hidden sm:block ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-scale-in z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-cream transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Calendar className="w-4 h-4 text-brand" />
                          My Dashboard
                        </Link>
                        <Link
                          href="/cart"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-cream transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <ShoppingBag className="w-4 h-4 text-brand" />
                          My Bag ({cartCount})
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-cream transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Heart className="w-4 h-4 text-brand" />
                          Wishlist
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-dark transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:inline-flex px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Book Now CTA */}
              <button
                onClick={handleBookClick}
                className="btn-shine btn-glow inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-brand text-white rounded-full text-xs sm:text-sm font-bold hover:bg-brand-dark transition-all duration-300 hover:scale-105 shadow-lg shadow-brand/25"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden xs:inline">Book Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ MAIN NAVIGATION BAR ══════════ */}
      <div
        className={`transition-all duration-500 border-t border-slate-100 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-sm"
            : "bg-white/90 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Desktop + Tablet */}
          <div className="hidden md:flex items-center justify-center gap-1 h-12">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-brand-dark hover:bg-brand-light/20 rounded-full transition-all duration-200 cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile: Scrollable pills + hamburger */}
          <div className="md:hidden flex items-center gap-2 h-12">
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-1 min-w-max">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-dark bg-slate-50 hover:bg-brand-light/20 rounded-full transition-all whitespace-nowrap cursor-pointer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <button
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile expanded menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-3 animate-fade-in">
            {user ? (
              <div>
                <div className="flex items-center gap-3 mb-3 px-1">
                  <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/book"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-sm text-slate-700 hover:bg-brand-light/20 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-brand" />
                    My Sessions
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-sm text-slate-700 hover:bg-brand-light/20 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-brand" />
                    Bag ({cartCount})
                  </Link>
                  <button
                    onClick={async () => {
                      await handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-xl text-sm text-rose-600 hover:bg-rose-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
