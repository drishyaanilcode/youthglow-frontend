const features = [
  {
    emoji: "🧪",
    title: "Dermatologist Tested",
    description: "Clinically approved formulas safe for all skin types.",
    gradient: "from-blue-50 to-cyan-50",
    border: "border-blue-100",
  },
  {
    emoji: "🐰",
    title: "100% Cruelty Free",
    description: "No animal testing, ever. Ethical beauty you can feel good about.",
    gradient: "from-pink-50 to-rose-50",
    border: "border-pink-100",
  },
  {
    emoji: "🌿",
    title: "Clean Ingredients",
    description: "Free from parabens, sulfates, and harmful chemicals.",
    gradient: "from-green-50 to-emerald-50",
    border: "border-green-100",
  },
  {
    emoji: "🚚",
    title: "Free Delivery UAE",
    description: "Same-day delivery in Dubai on orders over AED 150.",
    gradient: "from-amber-50 to-yellow-50",
    border: "border-amber-100",
  },
];

export default function WhySection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">
            Why Young Glow
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Beauty You Can Trust
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group relative rounded-3xl bg-gradient-to-br ${f.gradient} border ${f.border} p-7 text-center transition-all duration-500 hover:scale-105 hover:shadow-xl`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/40 transition-colors duration-500" />
              <div className="relative">
                <span className="text-4xl block mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">
                  {f.emoji}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
