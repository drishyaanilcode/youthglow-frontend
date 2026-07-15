import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    image: "/images/skincare.jpeg",
    name: "Skincare",
    description: "Hydrating serums, moisturizers, and treatments for every skin type.",
    count: 86,
    href: "/shop?category=skincare",
  },
  {
    image: "/images/makeup.jpeg",
    name: "Makeup",
    description: "Long-wear foundations, bold lips, and eye-catching palettes.",
    count: 124,
    href: "/shop?category=makeup",
  },
  {
    image: "/images/tools.jpeg",
    name: "Beauty Essentials",
    description: "Tools, brushes, and must-have accessories for your routine.",
    count: 52,
    href: "/shop?category=essentials",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">
            Browse Categories
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Shop by Category
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3
                  className="text-xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {cat.name}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/80 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    {cat.count} Products
                  </span>
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-900 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
