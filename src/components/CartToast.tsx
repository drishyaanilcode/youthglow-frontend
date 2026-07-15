"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, X, Check } from "lucide-react";

interface CartToastProps {
  show: boolean;
  productName: string;
  onClose: () => void;
}

export default function CartToast({ show, productName, onClose }: CartToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] animate-fade-in-up max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">Added to Bag!</p>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {productName}
          </p>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 mt-2 px-4 py-1.5 bg-brand text-white rounded-full text-xs font-bold hover:bg-brand-dark transition-colors"
          >
            <ShoppingBag className="w-3 h-3" />
            View Bag
          </Link>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
