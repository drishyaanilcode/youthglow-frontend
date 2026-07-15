"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import Link from "next/link";
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  if (!showLoginModal) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let result;
    if (mode === "login") {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData);
    }

    if (!result.ok) {
      setError(result.error || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => setShowLoginModal(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Close */}
        <button
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">✦</span>
            <span
              className="text-xl font-semibold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Young Glow
            </span>
          </div>
          <h2
            className="text-2xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {mode === "login"
              ? "Login to book appointments & shop"
              : "Join us for a radiant experience"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {mode === "register" && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={mode === "register" ? "Create Password (min 6 chars)" : "Password"}
              required
              minLength={mode === "register" ? 6 : undefined}
              className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-rose-500 text-sm text-center bg-rose-50 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-shine w-full flex items-center justify-center gap-2 py-3.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-all disabled:opacity-50 shadow-lg shadow-brand/20"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {mode === "login" ? "Login" : "Create Account"}
              </>
            )}
          </button>

          {/* Toggle mode */}
          <p className="text-center text-sm text-slate-500">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                  className="font-semibold text-brand hover:text-brand-dark transition-colors"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="font-semibold text-brand hover:text-brand-dark transition-colors"
                >
                  Login
                </button>
              </>
            )}
          </p>

          {/* Or go to full pages */}
          <div className="text-center">
            <Link
              href={mode === "login" ? "/login" : "/register"}
              onClick={() => setShowLoginModal(false)}
              className="text-xs text-slate-400 hover:text-brand transition-colors"
            >
              Open full {mode === "login" ? "login" : "registration"} page →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
