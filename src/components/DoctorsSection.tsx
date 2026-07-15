"use client";

import { useRouter } from "next/navigation";
import { Star, Award, GraduationCap, Clock } from "lucide-react";
import { useAuth } from "./AuthProvider";

const doctors = [
  {
    name: "Dr. Amira Al Mansoori",
    title: "Lead Dermatologist",
    specialties: ["Laser Therapies", "Wrinkle Reduction", "Skin Boosters"],
    experience: "15+ Years",
    education: "MBBS, MD Dermatology — University of Sharjah",
    rating: 4.9,
    reviews: 482,
    image:
      "https://images.pexels.com/photos/32428850/pexels-photo-32428850.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
    available: true,
  },
  {
    name: "Dr. Khalid Rashid",
    title: "Aesthetic Medicine Specialist",
    specialties: ["Filler Treatments", "Thread Lift", "PRP/PRF"],
    experience: "12+ Years",
    education: "MBBS, Fellowship Aesthetic Medicine — London",
    rating: 4.9,
    reviews: 367,
    image:
      "https://images.pexels.com/photos/17221169/pexels-photo-17221169.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
    available: true,
  },
  {
    name: "Dr. Fatima Hassan",
    title: "Cosmetic Dermatologist",
    specialties: ["Signature Facials", "Peels", "Microneedling"],
    experience: "10+ Years",
    education: "MD Dermatology, Diploma Cosmetology — Dubai",
    rating: 5.0,
    reviews: 291,
    image:
      "https://images.pexels.com/photos/32160039/pexels-photo-32160039.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
    available: true,
  },
  {
    name: "Dr. Sara Al Hashimi",
    title: "Laser & Skin Specialist",
    specialties: ["HIFU", "Photofacial", "Hair Removal"],
    experience: "8+ Years",
    education: "MBBS, MSc Dermatology — Abu Dhabi",
    rating: 4.8,
    reviews: 214,
    image:
      "https://images.pexels.com/photos/33756693/pexels-photo-33756693.png?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
    available: false,
  },
];

export default function DoctorsSection() {
  const { requireAuth } = useAuth();
  const router = useRouter();

  const handleBook = (e: React.MouseEvent) => {
    e.preventDefault();
    if (requireAuth()) {
      router.push("/book");
    }
  };

  return (
    <section id="doctors" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">
            Our Specialists
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Meet Our{" "}
            <span className="gradient-text">Expert Doctors</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Licensed dermatologists and aesthetic medicine specialists with
            decades of combined experience in advanced skin treatments.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doc, i) => (
            <div
              key={doc.name}
              className="group relative rounded-3xl bg-white border border-slate-100 overflow-hidden product-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Photo */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

                {/* Available badge */}
                {doc.available ? (
                  <span className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Available
                  </span>
                ) : (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-slate-600/80 backdrop-blur-sm text-white text-[11px] font-bold rounded-full">
                    Booked Today
                  </span>
                )}

                {/* Rating on image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-white">
                      {doc.rating}
                    </span>
                    <span className="text-xs text-white/70">
                      ({doc.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3
                  className="text-lg font-bold text-slate-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {doc.name}
                </h3>
                <p className="text-sm text-brand font-medium mt-0.5">
                  {doc.title}
                </p>

                {/* Experience & education */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                    {doc.experience} Experience
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <GraduationCap className="w-3.5 h-3.5 text-brand flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{doc.education}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {doc.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-cream-dark text-slate-600 text-[10px] font-medium rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Book button */}
                <button
                  onClick={handleBook}
                  disabled={!doc.available}
                  className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    doc.available
                      ? "bg-slate-900 text-white hover:bg-brand"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {doc.available ? "Book Session" : "Unavailable Today"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <Award className="w-5 h-5 text-brand" />, value: "15+", label: "Certified Doctors" },
            { icon: <Star className="w-5 h-5 text-brand" />, value: "4.9★", label: "Average Rating" },
            { icon: <GraduationCap className="w-5 h-5 text-brand" />, value: "80+", label: "Years Combined" },
            { icon: <Clock className="w-5 h-5 text-brand" />, value: "5000+", label: "Treatments Done" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-5 rounded-2xl bg-cream-dark border border-slate-100"
            >
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p
                className="text-2xl font-bold text-slate-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
