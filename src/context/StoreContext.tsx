"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { shippingFor, taxFor } from "@/lib/money";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  size: string;
  quantity: number;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string | null;
  telegramId?: string | null;
  username?: string | null;
};

type StoreContextValue = {
  // auth
  user: SessionUser | null;
  authReady: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  // cart
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  // cart drawer
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  // auth modal
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "apexvelocity.cart.v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const hydrated = useRef(false);

  // Hydrate cart from localStorage, then session + server cart.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* corrupted cart — start fresh */
    }
    hydrated.current = true;

    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          // Merge server-persisted cart with whatever is local.
          const cartRes = await fetch("/api/cart");
          const cartData = await cartRes.json();
          if (Array.isArray(cartData.items) && cartData.items.length) {
            setItems((local) => mergeCarts(local, cartData.items));
          }
        }
      } catch {
        /* offline — local cart still works */
      } finally {
        setAuthReady(true);
      }
    })();
  }, []);

  // Persist to localStorage on every change; mirror to server when logged in.
  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    if (user) {
      fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ productId, size, quantity }) => ({ productId, size, quantity })),
        }),
      }).catch(() => {});
    }
  }, [items, user]);

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.productId === item.productId && i.size === item.size,
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: Math.min(next[idx].quantity + quantity, 99) };
          return next;
        }
        return [...prev, { ...item, quantity }];
      });
      // Telegram haptic tap when running inside the TMA webview.
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("light");
      setCartOpen(true);
    },
    [],
  );

  const removeFromCart = useCallback((productId: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  }, []);

  const setQuantity = useCallback((productId: string, size: string, quantity: number) => {
    setItems((prev) =>
      quantity < 1
        ? prev.filter((i) => !(i.productId === productId && i.size === size))
        : prev.map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity: Math.min(quantity, 99) }
              : i,
          ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return (data.error as string) ?? "Login failed";
    setUser(data.user);
    return null;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return (data.error as string) ?? "Registration failed";
    setUser(data.user);
    return null;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }, []);

  /** Re-reads the session (used after Telegram auth) and merges the server cart. */
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user ?? null);
      if (data.user) {
        const cartRes = await fetch("/api/cart");
        const cartData = await cartRes.json();
        if (Array.isArray(cartData.items) && cartData.items.length) {
          setItems((local) => mergeCarts(local, cartData.items));
        }
      }
    } catch {
      /* network hiccup — session state stays as-is */
    }
  }, []);

  const totals = useMemo(() => {
    const subtotalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
    const shippingCents = shippingFor(subtotalCents);
    const taxCents = taxFor(subtotalCents);
    return {
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents: subtotalCents + shippingCents + taxCents,
      cartCount: items.reduce((sum, i) => sum + i.quantity, 0),
    };
  }, [items]);

  const value: StoreContextValue = {
    user,
    authReady,
    login,
    register,
    logout,
    refreshUser,
    items,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
    ...totals,
    cartOpen,
    setCartOpen,
    authOpen,
    setAuthOpen,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function mergeCarts(local: CartItem[], server: CartItem[]): CartItem[] {
  const merged = [...local];
  for (const s of server) {
    const idx = merged.findIndex((i) => i.productId === s.productId && i.size === s.size);
    if (idx >= 0) {
      merged[idx] = { ...merged[idx], quantity: Math.max(merged[idx].quantity, s.quantity) };
    } else {
      merged.push(s);
    }
  }
  return merged;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
