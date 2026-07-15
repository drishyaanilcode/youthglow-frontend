import Link from "next/link";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">✦</span>
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Young Glow
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Luxury skincare and makeup crafted for the modern woman.
              Based in Dubai, UAE.
            </p>
            <a
              href="mailto:info@youngglow.com"
              className="inline-flex items-center gap-2 text-sm text-brand-light hover:text-white transition-colors mb-6"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              info@youngglow.com
            </a>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop?category=skincare"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Skincare
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=makeup"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Makeup
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=essentials"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Essentials
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#doctors"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Our Doctors
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Book Session
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © 2026 Young Glow. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">
              🇦🇪 Made with love in Dubai
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
