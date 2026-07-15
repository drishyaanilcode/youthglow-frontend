import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string | null;
  rating: number;
  text: string;
}

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const gradients = [
    "from-rose-50 to-pink-50",
    "from-amber-50 to-orange-50",
    "from-violet-50 to-purple-50",
    "from-cyan-50 to-blue-50",
    "from-emerald-50 to-green-50",
    "from-fuchsia-50 to-pink-50",
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Loved by Thousands
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`testimonial-card relative rounded-3xl bg-gradient-to-br ${
                gradients[i % gradients.length]
              } border border-white/60 p-7 overflow-hidden`}
            >
              {/* Decorative quote */}
              <Quote className="absolute top-4 right-4 w-12 h-12 text-brand-light/30" />

              <div className="relative">
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= t.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-slate-200 text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-sm text-slate-700 leading-relaxed mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {t.avatar || t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500">{t.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
