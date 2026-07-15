"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  Check,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import CartToast from "@/components/CartToast";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: string;
  originalPrice: string | null;
  rating: string;
  reviewCount: number;
  image: string;
  badge: string | null;
  emoji: string | null;
  featured: boolean;
}

interface Category {
  label: string;
  value: string;
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

function AddToBagButton({
  productId,
  productName,
  onAdded,
}: {
  productId: number;
  productName: string;
  onAdded: (name: string) => void;
}) {
  const { requireAuth, refreshCart } = useAuth();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!requireAuth()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "product", productId }),
      });
      if (res.ok) {
        setAdded(true);
        await refreshCart();
        onAdded(productName);
        setTimeout(() => setAdded(false), 2000);
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
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
  );
}

export default function ShopContent({
  products,
  categories,
  activeCategory,
}: {
  products: Product[];
  categories: Category[];
  activeCategory: string;
}) {
  const [sortBy, setSortBy] = useState("newest");
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [toastProduct, setToastProduct] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleAdded = useCallback((name: string) => {
    setToastProduct(name);
    setShowToast(true);
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low")
      return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === "price-high")
      return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === "rating")
      return parseFloat(b.rating) - parseFloat(a.rating);
    return 0;
  });

  return (
    <div>
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={cat.value ? `/shop?category=${cat.value}` : "/shop"}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.value
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-brand-light hover:text-brand-dark"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setGridCols(3)}
              className={`p-1.5 rounded ${
                gridCols === 3 ? "bg-slate-900 text-white" : "text-slate-400"
              } transition-colors`}
              aria-label="3 columns"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-1.5 rounded ${
                gridCols === 4 ? "bg-slate-900 text-white" : "text-slate-400"
              } transition-colors`}
              aria-label="4 columns"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-6">
        Showing{" "}
        <span className="font-semibold text-slate-700">
          {sortedProducts.length}
        </span>{" "}
        products
      </p>

      <div
        className={`grid gap-6 ${
          gridCols === 4
            ? "sm:grid-cols-2 lg:grid-cols-4"
            : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {sortedProducts.map((product) => (
          <div
            key={product.id}
            className="product-card group relative rounded-3xl bg-white border border-slate-100 overflow-hidden"
          >
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
                <AddToBagButton
                  productId={product.id}
                  productName={product.name}
                  onAdded={handleAdded}
                />
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <StarRating rating={parseFloat(product.rating)} />
                <span className="text-xs text-slate-400">
                  ({product.reviewCount})
                </span>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                {product.brand}
              </p>
              <h3
                className="text-base font-semibold text-slate-900 mt-1 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {product.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center gap-2">
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
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">🔍</span>
          <h3
            className="text-2xl font-bold text-slate-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            No products found
          </h3>
          <p className="text-slate-500 mb-6">
            Try adjusting your filters or browse all products.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-brand transition-colors"
          >
            View All Products
          </Link>
        </div>
      )}

      <CartToast
        show={showToast}
        productName={toastProduct}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
