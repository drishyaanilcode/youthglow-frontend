"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Calendar, Clock, MapPin, User, Package, Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

interface Booking {
  id: number; serviceName: string; categoryName: string; branchName: string; branchAddress: string;
  doctorName: string | null; sessionDate: string; sessionTime: string; status: string;
  paymentMethod: string; isUpcoming: boolean;
}
interface ActivePackage {
  id: number; planName: string; sessionsUsed: number; sessionsTotal: number;
  startDate: string; endDate: string; nextSession: { date: string; time: string } | null;
}

export default function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [past, setPast] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<ActivePackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    fetch("/api/dashboard").then(r => r.json()).then(data => {
      setUpcoming(data.upcomingBookings || []);
      setPast(data.pastBookings || []);
      setPackages(data.activePackages || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || (loading && user)) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 mx-auto border-4 border-brand-light border-t-brand rounded-full animate-spin" />
        <p className="text-slate-500 mt-4">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-light/30 flex items-center justify-center"><Lock className="w-10 h-10 text-brand" /></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Login to View Dashboard</h2>
        <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white rounded-full text-sm font-bold hover:bg-brand-dark transition-colors">Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 mx-auto border-4 border-brand-light border-t-brand rounded-full animate-spin" />
        <p className="text-slate-500 mt-4">Loading your dashboard...</p>
      </div>
    );
  }

  const formatDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-AE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const formatShortDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-AE", { day: "numeric", month: "short" });

  return (
    <div className="space-y-10">
      {/* ===== Upcoming Bookings ===== */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            <Calendar className="w-5 h-5 text-brand" /> Upcoming Bookings
          </h2>
          <Link href="/book" className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1">
            Book New <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">No upcoming bookings</p>
            <Link href="/book" className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-dark transition-colors">Book a Session</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${b.status==="confirmed"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>
                        {b.status}
                      </span>
                      <span className="text-xs text-slate-400">{b.categoryName}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>{b.serviceName}</h3>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600"><Calendar className="w-4 h-4 text-brand flex-shrink-0" />{formatDate(b.sessionDate)}</div>
                      <div className="flex items-center gap-2 text-slate-600"><Clock className="w-4 h-4 text-brand flex-shrink-0" />{b.sessionTime}</div>
                      <div className="flex items-center gap-2 text-slate-600"><MapPin className="w-4 h-4 text-brand flex-shrink-0" />{b.branchName}</div>
                      {b.doctorName && <div className="flex items-center gap-2 text-slate-600"><User className="w-4 h-4 text-brand flex-shrink-0" />{b.doctorName}</div>}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-brand" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {formatShortDate(b.sessionDate)}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{b.paymentMethod === "reception" ? "Pay at reception" : "Paid online"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== Active Packages ===== */}
      {packages.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            <Package className="w-5 h-5 text-violet-600" /> Active Packages
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {packages.map(pkg => {
              const progress = Math.round((pkg.sessionsUsed / pkg.sessionsTotal) * 100);
              return (
                <div key={pkg.id} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>{pkg.planName}</h3>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-violet-100 text-violet-700">Active</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Sessions used</span>
                      <span className="font-semibold text-slate-900">{pkg.sessionsUsed}/{pkg.sessionsTotal}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Valid: {formatShortDate(pkg.startDate)} — {formatShortDate(pkg.endDate)}</p>
                    {pkg.nextSession && (
                      <p className="text-brand font-medium">Next: {formatShortDate(pkg.nextSession.date)} at {pkg.nextSession.time}</p>
                    )}
                  </div>
                  <Link href="/book" className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-brand transition-colors">
                    Book Next Session
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== Past Bookings ===== */}
      {past.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            <CheckCircle className="w-5 h-5 text-slate-400" /> Past Bookings
          </h2>
          <div className="space-y-3">
            {past.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 opacity-75">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-700 truncate">{b.serviceName}</p>
                  <p className="text-xs text-slate-400">{formatShortDate(b.sessionDate)} · {b.sessionTime} · {b.branchName}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{b.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {upcoming.length === 0 && packages.length === 0 && past.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>No Activity Yet</h3>
          <p className="text-slate-500 mb-6">Book your first session to get started</p>
          <Link href="/book" className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white rounded-full text-sm font-bold hover:bg-brand-dark transition-colors">Book Your First Session <ArrowRight className="w-4 h-4" /></Link>
        </div>
      )}
    </div>
  );
}
