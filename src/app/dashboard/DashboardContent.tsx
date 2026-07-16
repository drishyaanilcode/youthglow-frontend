"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { Calendar, MapPin, Clock, Package, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

interface Booking {
  id: number;
  serviceName: string;
  categoryName: string;
  branchName: string;
  branchAddress: string;
  doctorName: string;
  sessionDate: string;
  sessionTime: string;
  status: string;
  paymentMethod: string;
  isUpcoming: boolean;
}

interface PackageData {
  id: number;
  planName: string;
  sessionsUsed: number;
  sessionsBooked: number;
  sessionsTotal: number;
  sessionsAvailable: number;
  startDate: string;
  endDate: string;
  nextSession: { date: string; time: string } | null;
}

export default function DashboardContent() {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [past, setPast] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        setUpcoming(data.upcomingBookings || []);
        setPast(data.pastBookings || []);
        setPackages(data.activePackages || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Active Packages */}
      {packages.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            <Package className="w-5 h-5 text-brand" /> Active Packages
          </h2>
          <div className="grid gap-4">
            {packages.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{pkg.planName}</h3>
                    <p className="text-xs text-slate-500">Active until {formatShortDate(pkg.endDate)}</p>
                  </div>
                  <span className="text-sm font-bold bg-brand/10 text-brand px-3 py-1 rounded-full">{pkg.sessionsAvailable} available</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500">Used</p>
                    <p className="text-lg font-bold text-slate-900">{pkg.sessionsUsed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Booked</p>
                    <p className="text-lg font-bold text-slate-900">{pkg.sessionsBooked}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Available</p>
                    <p className="text-lg font-bold text-brand">{pkg.sessionsAvailable}</p>
                  </div>
                </div>

                {pkg.nextSession && (
                  <div className="bg-slate-50 rounded-xl p-3 mb-4 text-sm">
                    <p className="text-slate-600">Next session: <span className="font-semibold text-slate-900">{formatShortDate(pkg.nextSession.date)} at {pkg.nextSession.time}</span></p>
                  </div>
                )}

                {pkg.sessionsAvailable > 0 ? (
                  <Link href={`/book?usePackage=${pkg.id}`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-brand transition-colors">
                    Book Next Session ({pkg.sessionsAvailable} left)
                  </Link>
                ) : (
                  <p className="text-center text-xs text-slate-400">All sessions booked or completed</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Bookings */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            <Calendar className="w-5 h-5 text-brand" /> Upcoming Sessions
          </h2>
          <div className="space-y-3">
            {upcoming.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-100 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-slate-900">{b.serviceName}</p>
                    <p className="text-xs text-slate-500">{b.categoryName}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {b.status}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {formatShortDate(b.sessionDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {b.sessionTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {b.branchName}
                  </div>
                  <div className="text-xs text-slate-500 pl-6">{b.branchAddress}</div>
                  <div className="text-sm font-semibold text-slate-700 pt-2">Dr. {b.doctorName}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Bookings */}
      {past.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            <CheckCircle className="w-5 h-5 text-slate-400" /> Past Sessions
          </h2>
          <div className="space-y-2">
            {past.map(b => (
              <div key={b.id} className="bg-slate-50 rounded-xl border border-slate-100 p-3 flex items-center gap-3 opacity-75">
                <CheckCircle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{b.serviceName}</p>
                  <p className="text-xs text-slate-400">{formatShortDate(b.sessionDate)} · {b.sessionTime}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {upcoming.length === 0 && packages.length === 0 && past.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>No Activity Yet</h3>
          <p className="text-slate-500 mb-6">Book your first session to get started</p>
          <Link href="/book" className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white rounded-full text-sm font-bold hover:bg-brand-dark transition-colors">
            Book Your First Session <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
