"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar, Clock, CheckCircle, ArrowRight, ArrowLeft, Lock,
  Package, Zap, Search, MapPin, CreditCard, ShieldCheck, AlertTriangle,
  Stethoscope, Building2,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

/* ====== Types ====== */
interface Service { id: number; name: string; description: string | null; durationMinutes: number; price: string; emoji: string | null; image: string | null; }
interface Category { id: number; name: string; slug: string; emoji: string | null; image: string | null; description: string | null; services: Service[]; }
interface PackagePlan { id: number; name: string; durationMonths: number; sessionsIncluded: number; discountPercent: number; description: string | null; badge: string | null; }
interface Branch { id: number; name: string; address: string; mapUrl: string | null; phone: string | null; }
interface Props { categories: Category[]; packagePlans: PackagePlan[]; branches: Branch[]; initialType?: "single" | "package" | null; }

type Step = "type" | "plan" | "category" | "service" | "health" | "location" | "datetime" | "payment" | "done";

const HEALTH_QUESTIONS = [
  { key: "pregnant", label: "Are you currently pregnant or breastfeeding?", icon: "🤰" },
  { key: "allergies", label: "Do you have any skin allergies or sensitivities?", icon: "🤧" },
  { key: "bloodThinners", label: "Are you currently on blood thinners or anticoagulants?", icon: "💊" },
  { key: "sunExposure", label: "Have you had significant sun exposure in the past 48 hours?", icon: "☀️" },
  { key: "previousReactions", label: "Have you had any adverse reactions to previous treatments?", icon: "⚠️" },
];

const TIME_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM",
  "03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM",
  "06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM",
];

const DOCTORS = ["Dr. Amira Al Mansoori","Dr. Khalid Rashid","Dr. Fatima Hassan","Dr. Sara Al Hashimi"];

const STEP_ORDER_SINGLE: Step[] = ["type","category","service","health","location","datetime","payment","done"];
const STEP_ORDER_PACKAGE: Step[] = ["type","plan","category","service","health","location","datetime","payment","done"];

export default function BookingFlow({ categories, packagePlans, branches, initialType }: Props) {
  const { user, loading: authLoading, requireAuth, refreshCart } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>(
    initialType === "single" ? "category" : initialType === "package" ? "plan" : "type"
  );
  const [bookingType, setBookingType] = useState<"single"|"package"|null>(initialType || null);
  const [selectedPlan, setSelectedPlan] = useState<PackagePlan|null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category|null>(null);
  const [selectedService, setSelectedService] = useState<Service|null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch|null>(null);
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"reception"|"stripe">("reception");
  const [healthAnswers, setHealthAnswers] = useState<Record<string,boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [message, setMessage] = useState("");
  const [bookingId, setBookingId] = useState<number|null>(null);
  const [assignedDoctor] = useState(() => DOCTORS[Math.floor(Math.random()*DOCTORS.length)]);

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const stepOrder = bookingType === "package" ? STEP_ORDER_PACKAGE : STEP_ORDER_SINGLE;
  const currentStepIndex = stepOrder.indexOf(step);
  const totalSteps = stepOrder.length - 1; // exclude "done"

  const goBack = () => {
    if (currentStepIndex > 0) setStep(stepOrder[currentStepIndex - 1]);
  };

  const filteredCategories = searchQuery
    ? categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())))
    : categories;

  const calculatePrice = () => {
    if (!selectedService) return "0";
    const base = parseFloat(selectedService.price);
    if (bookingType==="package" && selectedPlan) {
      return (base * selectedPlan.sessionsIncluded * (1-selectedPlan.discountPercent/100)).toFixed(0);
    }
    return base.toFixed(0);
  };

  const handleConfirmBooking = async () => {
    if (!requireAuth()) return;
    if (!selectedService || !selectedBranch || !sessionDate || !sessionTime) {
      setStatus("error");
      setMessage("Missing booking details. Please go back and complete all steps.");
      return;
    }
    setStatus("loading");
    try {
      const payload = {
        type: bookingType,
        serviceId: selectedService.id,
        packagePlanId: selectedPlan?.id || null,
        branchId: selectedBranch.id,
        sessionDate,
        sessionTime,
        paymentMethod,
        healthScreening: JSON.stringify(healthAnswers),
      };
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setBookingId(data.bookingId);
        setStep("done");
        await refreshCart();
      } else {
        setStatus("error");
        setMessage(data.error || "Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  const resetAll = () => {
    setStep("type"); setBookingType(null); setSelectedPlan(null); setSelectedCategory(null);
    setSelectedService(null); setSelectedBranch(null); setSessionDate(""); setSessionTime("");
    setHealthAnswers({}); setStatus("idle"); setMessage(""); setSearchQuery("");
  };

  /* ====== LOADING ====== */
  if (authLoading) {
    return (
      <div className="pt-40 pb-20 px-4"><div className="mx-auto max-w-xl text-center py-16">
        <div className="w-12 h-12 mx-auto border-4 border-brand-light border-t-brand rounded-full animate-spin" />
        <p className="text-slate-500 mt-6">Loading...</p>
      </div></div>
    );
  }

  /* ====== NOT LOGGED IN ====== */
  if (!user) {
    return (
      <div className="pt-40 pb-20 px-4"><div className="mx-auto max-w-xl text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-light/30 flex items-center justify-center"><Lock className="w-10 h-10 text-brand" /></div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily:"'Playfair Display', serif" }}>Login to Book Sessions</h1>
        <p className="text-slate-500 mb-8">Create a free account or login to book beauty treatments.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand text-white rounded-full text-sm font-bold hover:bg-brand-dark transition-colors shadow-lg">Login</Link>
          <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-colors">Create Account</Link>
        </div>
      </div></div>
    );
  }

  /* ====== PROGRESS BAR ====== */
  const ProgressBar = () => (
    <div className="flex items-center justify-center gap-1 mb-10">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i < currentStepIndex ? "bg-brand w-8" : i === currentStepIndex ? "bg-brand w-12" : "bg-slate-200 w-6"}`} />
      ))}
    </div>
  );

  const BackBtn = () => (
    <button onClick={goBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Back</button>
  );

  return (
    <div className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily:"'Playfair Display', serif" }}>Book Your Session</h1>
          <p className="text-slate-500 mt-2">Single treatments or package plans with our specialists</p>
        </div>
        {step !== "type" && step !== "done" && <ProgressBar />}

        {/* ═══════════════════════════════════════════
            STEP: Choose Single or Package
        ═══════════════════════════════════════════ */}
        {step === "type" && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-900 text-center mb-8" style={{ fontFamily:"'Playfair Display', serif" }}>How would you like to book?</h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button onClick={() => { setBookingType("single"); setStep("category"); }} className="group relative rounded-3xl p-8 border-2 border-slate-100 bg-white hover:border-brand-light hover:shadow-xl transition-all text-left">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4"><Zap className="w-7 h-7 text-amber-600" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily:"'Playfair Display', serif" }}>Single Session</h3>
                <p className="text-sm text-slate-500 mb-4">One-time treatment with health screening, location & time selection.</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all">Browse Services <ArrowRight className="w-4 h-4" /></span>
              </button>
              <button onClick={() => { setBookingType("package"); setStep("plan"); }} className="group relative rounded-3xl p-8 border-2 border-slate-100 bg-white hover:border-brand-light hover:shadow-xl transition-all text-left">
                <div className="absolute -top-3 right-4 px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">Save up to 20%</div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-4"><Package className="w-7 h-7 text-violet-600" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily:"'Playfair Display', serif" }}>Package Plan</h3>
                <p className="text-sm text-slate-500 mb-4">Multiple sessions, dedicated doctor, priority booking. 1–12 months.</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all">View Plans <ArrowRight className="w-4 h-4" /></span>
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STEP: Choose Package Plan (package only)
        ═══════════════════════════════════════════ */}
        {step === "plan" && (
          <div className="animate-fade-in-up">
            <BackBtn />
            <h2 className="text-xl font-bold text-slate-900 text-center mb-8" style={{ fontFamily:"'Playfair Display', serif" }}>Choose Your Package Plan</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {packagePlans.map(plan => (
                <button key={plan.id} onClick={() => { setSelectedPlan(plan); setStep("category"); }}
                  className="relative text-left rounded-2xl p-6 border-2 border-slate-100 bg-white hover:border-brand-light hover:shadow-lg transition-all">
                  {plan.badge && <span className={`absolute -top-2 right-3 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${plan.badge==="VIP"?"bg-slate-900 text-white":plan.badge==="Best Value"?"bg-emerald-500 text-white":"bg-brand text-white"}`}>{plan.badge}</span>}
                  <p className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily:"'Playfair Display', serif" }}>{plan.name}</p>
                  <p className="text-sm text-slate-500 mb-3">{plan.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand">{plan.sessionsIncluded} sessions</span>
                    {plan.discountPercent > 0 && <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">{plan.discountPercent}% OFF</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STEP: Browse Service Categories
        ═══════════════════════════════════════════ */}
        {step === "category" && (
          <div className="animate-fade-in-up">
            <BackBtn />
            <h2 className="text-xl font-bold text-slate-900 text-center mb-2" style={{ fontFamily:"'Playfair Display', serif" }}>Browse Treatment Categories</h2>
            <p className="text-slate-500 text-center text-sm mb-6">{categories.length} categories available</p>
            {/* Search */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Search categories or treatments..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredCategories.map(cat => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat); setStep("service"); }}
                  className="group text-left rounded-2xl overflow-hidden border border-slate-100 bg-white hover:border-brand-light hover:shadow-xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-36 sm:h-44 overflow-hidden">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cream to-rose-50 flex items-center justify-center">
                        <span className="text-5xl">{cat.emoji}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="font-bold text-white text-sm drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>{cat.name}</p>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    {cat.description && <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2">{cat.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-semibold text-brand bg-brand-light/20 px-2 py-0.5 rounded-full">{cat.services.length} service{cat.services.length !== 1 ? "s" : ""}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {filteredCategories.length === 0 && <p className="text-center text-slate-500 py-10">No categories found for &ldquo;{searchQuery}&rdquo;</p>}
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STEP: Choose Specific Service
        ═══════════════════════════════════════════ */}
        {step === "service" && selectedCategory && (
          <div className="animate-fade-in-up">
            <BackBtn />
            <div className="text-center mb-8">
              {selectedCategory.image ? (
                <div className="w-20 h-20 mx-auto mb-3 rounded-2xl overflow-hidden shadow-lg">
                  <img src={selectedCategory.image} alt={selectedCategory.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <span className="text-5xl block mb-2">{selectedCategory.emoji}</span>
              )}
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily:"'Playfair Display', serif" }}>{selectedCategory.name}</h2>
              {selectedCategory.description && <p className="text-sm text-slate-500 mt-1">{selectedCategory.description}</p>}
            </div>
            <div className="space-y-3 max-w-2xl mx-auto">
              {selectedCategory.services.map(svc => {
                const displayPrice = bookingType === "package" && selectedPlan
                  ? (parseFloat(svc.price) * selectedPlan.sessionsIncluded * (1 - selectedPlan.discountPercent / 100)).toFixed(0)
                  : parseFloat(svc.price).toFixed(0);
                const originalPrice = bookingType === "package" && selectedPlan
                  ? (parseFloat(svc.price) * selectedPlan.sessionsIncluded).toFixed(0) : null;

                return (
                  <button key={svc.id} onClick={() => { setSelectedService(svc); setStep("health"); }}
                    className="w-full text-left rounded-2xl p-5 sm:p-6 border-2 border-slate-100 bg-white hover:border-brand-light hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily:"'Playfair Display', serif" }}>{svc.name}</h3>
                        {svc.description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{svc.description}</p>}
                        <div className="flex items-center gap-3 mt-3">
                          <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full"><Clock className="w-3 h-3" />{svc.durationMinutes} min</span>
                          <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">{selectedCategory.name}</span>
                          {bookingType === "package" && selectedPlan && (
                            <span className="text-xs text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full font-medium">× {selectedPlan.sessionsIncluded} sessions</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-brand">AED {displayPrice}</p>
                        {originalPrice && <p className="text-xs text-slate-400 line-through">AED {originalPrice}</p>}
                        <ArrowRight className="w-4 h-4 text-slate-300 mt-2 ml-auto" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STEP: Health Screening
        ═══════════════════════════════════════════ */}
        {step === "health" && (
          <div className="animate-fade-in-up">
            <BackBtn />
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center"><Stethoscope className="w-8 h-8 text-blue-600" /></div>
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily:"'Playfair Display', serif" }}>Health Screening</h2>
              <p className="text-slate-500 mt-2 text-sm">Please answer these questions for your safety before <strong>{selectedService?.name}</strong></p>
            </div>
            <div className="max-w-xl mx-auto space-y-3">
              {HEALTH_QUESTIONS.map(q => (
                <div key={q.key} className="flex items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">{q.icon}</span>
                    <p className="text-sm text-slate-700 leading-relaxed">{q.label}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <button onClick={() => setHealthAnswers({...healthAnswers, [q.key]: true})}
                      className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${healthAnswers[q.key] === true ? "bg-rose-500 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600"}`}>Yes</button>
                    <button onClick={() => setHealthAnswers({...healthAnswers, [q.key]: false})}
                      className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${healthAnswers[q.key] === false ? "bg-emerald-500 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"}`}>No</button>
                  </div>
                </div>
              ))}
              {Object.values(healthAnswers).some(v => v === true) && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">Some of your answers may require a doctor&apos;s review. Our team will contact you before your session.</p>
                </div>
              )}
              <div className="flex justify-end pt-4">
                <button onClick={() => setStep("location")} disabled={Object.keys(healthAnswers).length < HEALTH_QUESTIONS.length}
                  className="btn-shine inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-slate-900/20">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STEP: Choose Location
        ═══════════════════════════════════════════ */}
        {step === "location" && (
          <div className="animate-fade-in-up">
            <BackBtn />
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-50 flex items-center justify-center"><Building2 className="w-8 h-8 text-violet-600" /></div>
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily:"'Playfair Display', serif" }}>Choose Branch Location</h2>
              <p className="text-slate-500 mt-2 text-sm">Select your preferred clinic</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {branches.map(b => (
                <button key={b.id} onClick={() => { setSelectedBranch(b); setStep("datetime"); }}
                  className="text-left rounded-2xl p-6 border-2 border-slate-100 bg-white hover:border-brand-light hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-brand-light/20 flex items-center justify-center mb-4 group-hover:bg-brand-light/40 transition-colors">
                    <MapPin className="w-6 h-6 text-brand" />
                  </div>
                  <p className="font-bold text-slate-900 mb-1" style={{ fontFamily:"'Playfair Display', serif" }}>{b.name}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{b.address}</p>
                  {b.phone && <p className="text-xs text-brand font-semibold">{b.phone}</p>}
                  {b.mapUrl && (
                    <span onClick={e => { e.stopPropagation(); window.open(b.mapUrl!, "_blank"); }}
                      className="inline-flex items-center gap-1 mt-3 text-[11px] text-slate-400 hover:text-brand transition-colors cursor-pointer">
                      <MapPin className="w-3 h-3" /> View on Map
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STEP: Date & Time
        ═══════════════════════════════════════════ */}
        {step === "datetime" && (
          <div className="animate-fade-in-up">
            <BackBtn />
            <h2 className="text-xl font-bold text-slate-900 text-center mb-2" style={{ fontFamily:"'Playfair Display', serif" }}>
              {bookingType === "package" ? "Pick Your First Session" : "Pick Date & Time"}
            </h2>
            <p className="text-slate-500 text-center text-sm mb-8">at {selectedBranch?.name}</p>
            <div className="max-w-2xl mx-auto">
              {/* Date */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3"><Calendar className="w-4 h-4 text-brand" /> Preferred Date</label>
                <input type="date" min={minDate} value={sessionDate} onChange={e => setSessionDate(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all cursor-pointer hover:border-brand-light" />
              </div>
              {/* Time */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3"><Clock className="w-4 h-4 text-brand" /> Preferred Time</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {TIME_SLOTS.map(t => (
                    <button key={t} onClick={() => setSessionTime(t)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${sessionTime === t ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-100 text-slate-600 hover:border-brand-light hover:text-brand-dark"}`}>{t}</button>
                  ))}
                </div>
              </div>
              {/* Assigned Doctor */}
              <div className="bg-cream-dark rounded-2xl p-4 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white text-lg">👩‍⚕️</div>
                <div>
                  <p className="text-xs text-slate-500">Assigned Doctor</p>
                  <p className="text-sm font-bold text-slate-900">{assignedDoctor}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => setStep("payment")} disabled={!sessionDate || !sessionTime}
                  className="btn-shine inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-slate-900/20">
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STEP: Payment & Confirmation
        ═══════════════════════════════════════════ */}
        {step === "payment" && (
          <div className="animate-fade-in-up">
            <BackBtn />
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center"><CreditCard className="w-8 h-8 text-emerald-600" /></div>
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily:"'Playfair Display', serif" }}>Payment & Confirmation</h2>
            </div>
            <div className="max-w-xl mx-auto">
              {/* Payment Options */}
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Choose Payment Method</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <button onClick={() => setPaymentMethod("reception")}
                  className={`text-left rounded-2xl p-6 border-2 transition-all ${paymentMethod === "reception" ? "border-brand bg-brand/5 shadow-lg" : "border-slate-100 bg-white hover:border-brand-light"}`}>
                  <Building2 className="w-7 h-7 text-brand mb-3" />
                  <p className="font-bold text-slate-900">Pay at Reception</p>
                  <p className="text-xs text-slate-500 mt-1">Cash or card when you arrive</p>
                </button>
                <button onClick={() => setPaymentMethod("stripe")}
                  className={`text-left rounded-2xl p-6 border-2 transition-all ${paymentMethod === "stripe" ? "border-brand bg-brand/5 shadow-lg" : "border-slate-100 bg-white hover:border-brand-light"}`}>
                  <CreditCard className="w-7 h-7 text-violet-600 mb-3" />
                  <p className="font-bold text-slate-900">Pay Online</p>
                  <p className="text-xs text-slate-500 mt-1">Secure payment via Stripe</p>
                </button>
              </div>

              {/* Full Summary */}
              <div className="bg-cream-dark rounded-2xl p-6 mb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand" /> Booking Summary</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Patient</span><span className="font-medium text-slate-900">{user.fullName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-medium text-slate-900">{bookingType === "package" ? `Package — ${selectedPlan?.name}` : "Single Session"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Service</span><span className="font-medium text-slate-900">{selectedService?.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Duration</span><span className="font-medium text-slate-900">{selectedService?.durationMinutes} min{bookingType === "package" && selectedPlan ? ` × ${selectedPlan.sessionsIncluded}` : ""}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Category</span><span className="font-medium text-slate-900">{selectedCategory?.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="font-medium text-slate-900">{selectedBranch?.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Doctor</span><span className="font-medium text-slate-900">{assignedDoctor}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">{bookingType === "package" ? "First Session" : "Date & Time"}</span><span className="font-medium text-slate-900">{sessionDate && new Date(sessionDate + "T12:00:00").toLocaleDateString("en-AE", { weekday: "short", month: "short", day: "numeric" })} · {sessionTime}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Payment</span><span className="font-medium text-slate-900">{paymentMethod === "reception" ? "Pay at Reception" : "Online (Stripe)"}</span></div>
                  <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="font-bold text-brand text-xl">AED {calculatePrice()}</span>
                  </div>
                </div>
              </div>

              {status === "error" && <p className="text-rose-500 text-sm text-center bg-rose-50 rounded-xl px-4 py-3 mb-4">{message}</p>}

              <button onClick={handleConfirmBooking} disabled={status === "loading"}
                className="btn-shine w-full flex items-center justify-center gap-2 py-4 bg-brand text-white rounded-2xl text-base font-bold hover:bg-brand-dark transition-all disabled:opacity-40 shadow-lg shadow-brand/20 hover:shadow-xl">
                {status === "loading" ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Confirm Booking</>}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STEP: Done / Confirmation
        ═══════════════════════════════════════════ */}
        {step === "done" && (
          <div className="animate-scale-in text-center py-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle className="w-12 h-12 text-emerald-600" /></div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily:"'Playfair Display', serif" }}>Booking Confirmed! 🎉</h2>
            <p className="text-slate-600 mb-2">{message}</p>
            {bookingId && <p className="text-sm text-slate-400 mb-8">Reference: <span className="font-bold text-brand">#{bookingId.toString().padStart(5, "0")}</span></p>}
            <div className="max-w-md mx-auto bg-cream-dark rounded-2xl p-6 mb-8 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Service</span><span className="font-medium">{selectedService?.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="font-medium">{selectedBranch?.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Doctor</span><span className="font-medium">{assignedDoctor}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-medium">{sessionDate && new Date(sessionDate + "T12:00:00").toLocaleDateString("en-AE", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-medium">{sessionTime}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-medium text-emerald-600">✓ Confirmed</span></div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-dark transition-colors">View Dashboard <ArrowRight className="w-4 h-4" /></Link>
              <button onClick={resetAll} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors">Book Another Session</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
