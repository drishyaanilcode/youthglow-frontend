"use client";

import Link from "next/link";
import { Star, ShoppingBag, Heart, Check } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useState, useCallback } from "react";
import CartToast from "./CartToast";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: string;
  originalPrice: string | null;
  rating: string;
  reviewCount: number;
  image: string;
  badge: string | null;
  emoji: string | null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= rating
              ? "fill-yellow-400 text-yellow-400"
              : s - 0.5 <= rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  onAdded,
}: {
  product: Product;
  onAdded: (name: string) => void;
}) {
  const { requireAuth, refreshCart } = useAuth();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToBag = async () => {
    if (!requireAuth()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "product", productId: product.id }),
      });
      if (res.ok) {
        setAdded(true);
        await refreshCart();
        onAdded(product.name);
        setTimeout(() => setAdded(false), 2000);
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  return (
    <div className="product-card group relative rounded-3xl bg-white border border-slate-100 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-cream to-rose-50">
        {product.badge && (
          <span
            className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold ${
              product.badge.includes("%")
                ? "bg-rose-500 text-white"
                : "bg-slate-900 text-white"
            }`}
          >
            {product.badge}
          </span>
        )}
        <button
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4 text-slate-600" />
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToBag}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${
              added
                ? "bg-emerald-500 text-white"
                : "bg-slate-900 text-white hover:bg-brand"
            }`}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : added ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-5">
        <StarRating rating={parseFloat(product.rating)} />
        <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider">
          {product.brand}
        </p>
        <h3
          className="text-base font-semibold text-slate-900 mt-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-slate-900">
            AED {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-slate-400 line-through">
              AED {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  const [toastProduct, setToastProduct] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleAdded = useCallback((name: string) => {
    setToastProduct(name);
    setShowToast(true);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">
              Curated for You
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand-dark hover:text-brand transition-colors"
          >
            View All Products →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdded={handleAdded}
            />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-brand transition-colors"
          >
            View All Products →
          </Link>
        </div>
      </div>

      <CartToast
        show={showToast}
        productName={toastProduct}
        onClose={() => setShowToast(false)}
      />
    </section>
  );
}
