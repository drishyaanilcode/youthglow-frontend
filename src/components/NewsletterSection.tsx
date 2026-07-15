"use client";

import { useState } from "react";
import { Send, CheckCircle, Sparkles } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 sm:p-16 text-center">
          {/* Decorative */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-brand/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand/5 rounded-full blur-2xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-brand-light" />
              <span className="text-sm text-brand-light font-medium">
                Exclusive Offer
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Get 15% Off Your First Order
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto mb-8">
              Join 50,000+ beauty lovers. Get early access to new launches,
              exclusive offers, and beauty tips.
            </p>

            {status === "success" ? (
              <div className="animate-scale-in flex items-center justify-center gap-2 text-emerald-400">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">{message}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-5 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-shine flex items-center justify-center gap-2 px-8 py-4 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-dark transition-all duration-300 disabled:opacity-50 shadow-lg shadow-brand/30 hover:shadow-xl hover:shadow-brand/40"
                >
                  {status === "loading" ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="text-rose-400 text-sm mt-3">{message}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
