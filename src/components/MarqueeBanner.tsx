const items = [
  "Luxury Skincare",
  "Premium Makeup",
  "Beauty Essentials",
  "Glow Serums",
  "Expert Treatments",
  "UAE Beauty Brand",
];

export default function MarqueeBanner() {
  return (
    <div className="bg-slate-900 text-white py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center mx-6 text-sm font-medium tracking-wide">
            <span className="text-brand mr-3">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
