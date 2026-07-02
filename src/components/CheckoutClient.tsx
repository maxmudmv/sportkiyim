"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Lock, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { useTelegram } from "@/context/TelegramContext";
import { formatMoney } from "@/lib/money";

type Fields = {
  email: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type FieldErrors = Partial<Record<keyof Fields, string>>;

const COUNTRIES = ["United States", "United Kingdom", "Canada", "Uzbekistan", "Germany", "France"];

export default function CheckoutClient() {
  const {
    items,
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents,
    clearCart,
    user,
    setAuthOpen,
    authReady,
  } = useStore();
  const { isTelegram, tgUser } = useTelegram();

  const [fields, setFields] = useState<Fields>({
    email: "",
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{ id: string; totalCents: number } | null>(null);

  // Pre-fill shipping details from the Telegram profile / logged-in account.
  useEffect(() => {
    const tgName = tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ") : "";
    setFields((f) => ({
      ...f,
      email: f.email || user?.email || "",
      fullName: f.fullName || tgName || user?.name || "",
    }));
  }, [user, tgUser]);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = "Enter a valid email";
    if (fields.fullName.trim().length < 2) next.fullName = "Full name is required";
    if (fields.address.trim().length < 4) next.address = "Enter your street address";
    if (!fields.city.trim()) next.city = "City is required";
    if (!fields.postalCode.trim()) next.postalCode = "Postal code is required";
    if (!fields.country) next.country = "Select a country";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = async () => {
    setSubmitError(null);
    if (!validate()) {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("warning");
      return;
    }

    setSubmitting(true);
    window.Telegram?.WebApp?.MainButton?.showProgress();
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          items: items.map(({ productId, size, quantity }) => ({ productId, size, quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong placing your order");
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("error");
      } else {
        setPlacedOrder({ id: data.order.id, totalCents: data.order.totalCents });
        clearCart();
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
      }
    } catch {
      setSubmitError("Network error — please try again");
    } finally {
      setSubmitting(false);
      window.Telegram?.WebApp?.MainButton?.hideProgress();
    }
  };

  // Telegram MainButton ("PAY …") fires this event from the provider.
  const placeOrderRef = useRef(placeOrder);
  placeOrderRef.current = placeOrder;
  useEffect(() => {
    const onTmaPay = () => {
      if (!placeOrderRef.current) return;
      placeOrderRef.current();
    };
    window.addEventListener("tma:pay", onTmaPay);
    return () => window.removeEventListener("tma:pay", onTmaPay);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await placeOrder();
  };

  // ---- Success state -------------------------------------------------
  if (placedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center flex flex-col items-center gap-6">
        <CheckCircle2 size={64} className="text-primary-fixed" />
        <h1 className="font-display text-headline-lg text-primary uppercase tracking-tight">
          Order Confirmed
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Payment of <span className="text-primary-fixed font-bold">{formatMoney(placedOrder.totalCents)}</span>{" "}
          approved. Your gear is being prepped for dispatch.
        </p>
        <p className="text-sm text-on-surface-variant bg-surface-container rounded border border-outline-variant/50 px-4 py-3">
          Order reference: <span className="text-primary font-mono">{placedOrder.id}</span>
        </p>
        <Link href="/shop" className="btn-primary mt-4">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ---- Empty cart state ----------------------------------------------
  if (authReady && items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center flex flex-col items-center gap-6">
        <ShoppingCart size={64} className="text-on-surface-variant opacity-40" />
        <h1 className="font-display text-headline-lg text-primary uppercase">Your cart is empty</h1>
        <p className="text-body-md text-on-surface-variant">
          Add some gear before heading to checkout.
        </p>
        <Link href="/shop" className="btn-primary">
          Shop All Gear
        </Link>
      </div>
    );
  }

  // ---- Checkout form ---------------------------------------------------
  return (
    <div className="max-w-container mx-auto px-4 md:px-12 py-12">
      <div className="flex items-center gap-3 mb-10">
        <Lock size={22} className="text-primary-fixed" />
        <h1 className="section-title !border-0 !pl-0">Secure Checkout</h1>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
        {/* Left: forms */}
        <div className="flex flex-col gap-10">
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display text-headline-md text-primary uppercase">
                Contact Information
              </h2>
              {!user && (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="text-label-md text-primary-fixed hover:text-primary transition-colors uppercase"
                >
                  Log in
                </button>
              )}
            </div>
            <Field error={errors.email}>
              <input
                className="kinetic-input"
                type="email"
                placeholder="Email address"
                value={fields.email}
                onChange={set("email")}
                autoComplete="email"
              />
            </Field>
          </section>

          <section>
            <h2 className="font-display text-headline-md text-primary uppercase mb-5">
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field error={errors.fullName}>
                  <input
                    className="kinetic-input"
                    placeholder="Full name"
                    value={fields.fullName}
                    onChange={set("fullName")}
                    autoComplete="name"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field error={errors.address}>
                  <input
                    className="kinetic-input"
                    placeholder="Street address"
                    value={fields.address}
                    onChange={set("address")}
                    autoComplete="street-address"
                  />
                </Field>
              </div>
              <Field error={errors.city}>
                <input
                  className="kinetic-input"
                  placeholder="City"
                  value={fields.city}
                  onChange={set("city")}
                  autoComplete="address-level2"
                />
              </Field>
              <Field error={errors.postalCode}>
                <input
                  className="kinetic-input"
                  placeholder="Postal code"
                  value={fields.postalCode}
                  onChange={set("postalCode")}
                  autoComplete="postal-code"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field error={errors.country}>
                  <select
                    className="kinetic-input"
                    value={fields.country}
                    onChange={set("country")}
                    autoComplete="country-name"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-headline-md text-primary uppercase mb-5">Payment</h2>
            <div className="bg-surface-container rounded border border-outline-variant/50 p-5 text-on-surface-variant text-body-md">
              <p className="flex items-center gap-2">
                <Lock size={16} className="text-primary-fixed" />
                Local demo mode — payment is mocked and always approved. No card required.
              </p>
            </div>
          </section>

          {submitError && (
            <p className="text-error bg-error-container/30 border border-error-container rounded p-4">
              {submitError}
            </p>
          )}
        </div>

        {/* Right: order summary */}
        <aside className="bg-surface-container-low border border-outline-variant/50 rounded p-6 h-fit lg:sticky lg:top-28">
          <h2 className="font-display text-headline-md text-primary uppercase mb-6">
            Order Summary
          </h2>
          <div className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-1 mb-6">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-3 items-center">
                <div className="relative w-14 h-14 bg-surface-container-highest rounded overflow-hidden shrink-0">
                  <Image src={item.imageUrl} alt={item.name} fill sizes="56px" className="object-cover" />
                  <span className="absolute -top-0 -right-0 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded-bl px-1.5 py-0.5">
                    ×{item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md text-primary truncate">{item.name}</p>
                  <p className="text-xs text-on-surface-variant">Size {item.size}</p>
                </div>
                <span className="text-body-md text-on-surface shrink-0">
                  {formatMoney(item.priceCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-outline-variant/50 pt-4">
            <SummaryRow label="Subtotal" value={formatMoney(subtotalCents)} />
            <SummaryRow
              label="Shipping"
              value={shippingCents === 0 ? "FREE" : formatMoney(shippingCents)}
              accent={shippingCents === 0}
            />
            <SummaryRow label="Estimated Tax (8%)" value={formatMoney(taxCents)} />
            <div className="flex justify-between text-body-lg font-bold text-primary border-t border-outline-variant/50 pt-3 mt-1">
              <span>Total</span>
              <span className="text-primary-fixed">{formatMoney(totalCents)}</span>
            </div>
          </div>

          {isTelegram ? (
            <p className="text-sm text-on-surface-variant text-center mt-6 bg-surface-container rounded border border-primary-fixed/30 p-3">
              Use the <span className="text-primary-fixed font-bold">PAY</span> button at the
              bottom of Telegram to place your order.
            </p>
          ) : (
            <button type="submit" disabled={submitting} className="btn-primary w-full mt-6">
              {submitting ? "Processing…" : `Pay ${formatMoney(totalCents)}`}
            </button>
          )}
          <p className="text-xs text-on-surface-variant/60 text-center mt-3">
            Prices are recalculated securely on the server.
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      {error && <p className="text-error text-sm mt-1.5">{error}</p>}
    </div>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-body-md">
      <span className="text-on-surface-variant">{label}</span>
      <span className={accent ? "text-primary-fixed font-bold" : "text-on-surface"}>{value}</span>
    </div>
  );
}
