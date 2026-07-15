"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Trash2, ShoppingBag, Calendar, Package, ArrowRight, Lock } from "lucide-react";

interface CartItem {
  id: number;
  type: "product" | "single_session" | "package";
  quantity: number;
  sessionDate?: string;
  sessionTime?: string;
  product?: {
    id: number;
    name: string;
    price: string;
    image: string;
    emoji: string | null;
    brand: string;
  };
  service?: {
    id: number;
    name: string;
    price: string;
    duration: number;
    categoryName: string;
    categoryEmoji: string;
  };
  packagePlan?: {
    id: number;
    name: string;
    sessionsIncluded: number;
    discountPercent: number;
  } | null;
}

export default function CartContent() {
  const { user, loading: authLoading, refreshCart } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (user) fetchCart();
    else setLoading(false);
  }, [user, authLoading]);

  const handleRemove = async (itemId: number) => {
    setRemoving(itemId);
    try {
      await fetch(`/api/cart?id=${itemId}`, { method: "DELETE" });
      setItems(items.filter(i => i.id !== itemId));
      await refreshCart();
    } catch {
      // ignore
    }
    setRemoving(null);
  };

  const calculateItemPrice = (item: CartItem) => {
    if (item.type === "product" && item.product) {
      return (parseFloat(item.product.price) * item.quantity).toFixed(2);
    }
    if ((item.type === "single_session" || item.type === "package") && item.service) {
      const basePrice = parseFloat(item.service.price);
      if (item.packagePlan) {
        return (basePrice * item.packagePlan.sessionsIncluded * (1 - item.packagePlan.discountPercent / 100)).toFixed(0);
      }
      return basePrice.toFixed(0);
    }
    return "0";
  };

  const productItems = items.filter(i => i.type === "product");
  const sessionItems = items.filter(i => i.type === "single_session" || i.type === "package");

  const productsTotal = productItems.reduce((sum, i) => sum + parseFloat(calculateItemPrice(i)), 0);
  const sessionsTotal = sessionItems.reduce((sum, i) => sum + parseFloat(calculateItemPrice(i)), 0);
  const grandTotal = productsTotal + sessionsTotal;

  if (authLoading) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 mx-auto border-4 border-brand-light border-t-brand rounded-full animate-spin" />
        <p className="text-slate-500 mt-4">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-light/30 flex items-center justify-center">
          <Lock className="w-10 h-10 text-brand" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Login to View Your Bag
        </h2>
        <p className="text-slate-500 mb-8">Your products and booked sessions will appear here.</p>
        <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white rounded-full text-sm font-bold hover:bg-brand-dark transition-colors">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 mx-auto border-4 border-brand-light border-t-brand rounded-full animate-spin" />
        <p className="text-slate-500 mt-4">Loading your bag...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Your Bag is Empty
        </h2>
        <p className="text-slate-500 mb-8">Add products or book sessions to get started.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors">
            <ShoppingBag className="w-4 h-4" /> Shop Products
          </Link>
          <Link href="/book" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-dark transition-colors">
            <Calendar className="w-4 h-4" /> Book Session
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Products Section */}
      {productItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand" />
            <h2 className="font-semibold text-slate-900">Products for Delivery</h2>
            <span className="ml-auto text-sm text-slate-500">{productItems.length} items</span>
          </div>
          <div className="divide-y divide-slate-100">
            {productItems.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cream to-rose-50 flex items-center justify-center flex-shrink-0">
                  {item.product?.emoji ? (
                    <span className="text-3xl">{item.product.emoji}</span>
                  ) : (
                    <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover rounded-xl" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{item.product?.name}</p>
                  <p className="text-xs text-slate-500">{item.product?.brand}</p>
                  <p className="text-sm font-bold text-brand mt-1">AED {item.product?.price} × {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">AED {calculateItemPrice(item)}</p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={removing === item.id}
                    className="text-slate-400 hover:text-rose-500 transition-colors mt-1"
                    aria-label="Remove"
                  >
                    {removing === item.id ? (
                      <span className="w-4 h-4 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin inline-block" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions Section */}
      {sessionItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand" />
            <h2 className="font-semibold text-slate-900">Booked Sessions</h2>
            <span className="ml-auto text-sm text-slate-500">{sessionItems.length} sessions</span>
          </div>
          <div className="divide-y divide-slate-100">
            {sessionItems.map((item) => (
              <div key={item.id} className="p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                  {item.type === "package" ? <Package className="w-6 h-6 text-violet-600" /> : <span className="text-2xl">{item.service?.categoryEmoji}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">{item.service?.name}</p>
                  <p className="text-xs text-slate-500">{item.service?.categoryName}</p>
                  {item.packagePlan && (
                    <p className="text-xs text-violet-600 font-medium mt-0.5">{item.packagePlan.name} · {item.packagePlan.sessionsIncluded} sessions</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    📅 {item.sessionDate ? new Date(item.sessionDate + "T12:00:00").toLocaleDateString("en-AE", { weekday: "short", month: "short", day: "numeric" }) : "—"} at {item.sessionTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">AED {calculateItemPrice(item)}</p>
                  {item.packagePlan && (
                    <p className="text-[10px] text-emerald-600 font-bold">{item.packagePlan.discountPercent}% OFF</p>
                  )}
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={removing === item.id}
                    className="text-slate-400 hover:text-rose-500 transition-colors mt-1"
                    aria-label="Remove"
                  >
                    {removing === item.id ? (
                      <span className="w-4 h-4 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin inline-block" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-cream-dark rounded-2xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          {productsTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-500">Products Subtotal</span>
              <span className="text-slate-900">AED {productsTotal.toFixed(2)}</span>
            </div>
          )}
          {sessionsTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-500">Sessions Subtotal</span>
              <span className="text-slate-900">AED {sessionsTotal.toFixed(0)}</span>
            </div>
          )}
          {productsTotal > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Delivery</span>
              <span>{productsTotal >= 150 ? "FREE" : "AED 25"}</span>
            </div>
          )}
          <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between">
            <span className="font-semibold text-slate-900">Total</span>
            <span className="font-bold text-xl text-brand">
              AED {(grandTotal + (productsTotal > 0 && productsTotal < 150 ? 25 : 0)).toFixed(2)}
            </span>
          </div>
        </div>

        <button className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-brand text-white rounded-2xl text-base font-bold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20">
          Proceed to Checkout <ArrowRight className="w-5 h-5" />
        </button>
        {productsTotal > 0 && productsTotal < 150 && (
          <p className="text-xs text-center text-slate-500 mt-3">
            Add AED {(150 - productsTotal).toFixed(0)} more for free delivery
          </p>
        )}
      </div>
    </div>
  );
}
