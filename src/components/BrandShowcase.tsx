export default function BrandShowcase() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <img
                    src="/images/glow.jpg"
                    alt="Glowing skin"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.pexels.com/photos/4857813/pexels-photo-4857813.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    alt="Serum products"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.pexels.com/photos/3985338/pexels-photo-3985338.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                    alt="Spa treatment"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <img
                    src="/images/radiant.jpg"
                    alt="Radiant beauty"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-brand-light/30 rounded-full blur-xl" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-rose-200/30 rounded-full blur-xl" />
          </div>

          {/* Right - Content */}
          <div className="lg:pl-8">
            <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">
              Our Philosophy
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Where Science Meets
              <span className="block gradient-text">Natural Beauty</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              At Young Glow, we believe every woman deserves to feel radiant.
              Our expert formulations combine cutting-edge skincare science with
              the finest natural ingredients, carefully selected to work in
              harmony with your skin.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Born in the heart of Dubai, we understand the unique needs of
              skin in the Gulf climate. Each product is designed to hydrate,
              protect, and transform — delivering visible results you can see
              and feel.
            </p>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                { icon: "🔬", text: "Advanced bio-active formulations" },
                { icon: "🌸", text: "Ethically sourced ingredients" },
                { icon: "💧", text: "Deep hydration technology" },
                { icon: "✅", text: "Approved by top dermatologists" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-cream-dark text-lg">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
