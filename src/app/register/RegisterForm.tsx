"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await register(formData);
    if (result.ok) {
      router.push("/");
    } else {
      setError(result.error || "Registration failed.");
    }
    setLoading(false);
  };

  const inputClass =
    "w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all hover:border-brand-light";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className={inputClass}
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          className={inputClass}
        />
      </div>

      <div className="relative">
        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number (e.g. +971 50 123 4567)"
          required
          className={inputClass}
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create Password (min 6 characters)"
          required
          minLength={6}
          className="w-full pl-11 pr-12 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all hover:border-brand-light"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label="Toggle password"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {error && (
        <p className="text-rose-500 text-sm text-center bg-rose-50 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-shine w-full flex items-center justify-center gap-2 py-4 bg-brand text-white rounded-2xl text-base font-bold hover:bg-brand-dark transition-all disabled:opacity-50 shadow-lg shadow-brand/20 hover:shadow-xl"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Create Account
          </>
        )}
      </button>

      <p className="text-center text-sm text-slate-500 pt-2">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:text-brand-dark transition-colors">
          Login
        </Link>
      </p>
    </form>
  );
}
