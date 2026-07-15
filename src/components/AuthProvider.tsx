"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  cartCount: number;
  productCount: number;
  sessionCount: number;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshCart: () => Promise<void>;
  requireAuth: () => boolean;
  showLoginModal: boolean;
  setShowLoginModal: (v: boolean) => void;
  loginRedirect: string;
  setLoginRedirect: (v: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState("");

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCartCount(data.totalCount || 0);
        setProductCount(data.productCount || 0);
        setSessionCount(data.sessionCount || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) refreshCart();
    else {
      setCartCount(0);
      setProductCount(0);
      setSessionCount(0);
    }
  }, [user, refreshCart]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setShowLoginModal(false);
      return { ok: true };
    }
    return { ok: false, error: data.error };
  };

  const register = async (formData: { fullName: string; email: string; phone: string; password: string }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setShowLoginModal(false);
      return { ok: true };
    }
    return { ok: false, error: data.error };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setCartCount(0);
    setProductCount(0);
    setSessionCount(0);
  };

  const requireAuth = () => {
    if (!user) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        cartCount,
        productCount,
        sessionCount,
        login,
        register,
        logout,
        refreshCart,
        requireAuth,
        showLoginModal,
        setShowLoginModal,
        loginRedirect,
        setLoginRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
