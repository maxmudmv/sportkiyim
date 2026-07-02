"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatMoney, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/money";

export default function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    items,
    setQuantity,
    removeFromCart,
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents,
  } = useStore();

  const remainingForFree = FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-surface-container-low border-l border-outline-variant z-[70] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-outline-variant">
              <h2 className="font-display text-headline-md text-primary uppercase tracking-tight">
                Your Cart
              </h2>
              <button
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
                className="text-on-surface-variant hover:text-primary-fixed transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-on-surface-variant">
                <ShoppingCart size={48} className="opacity-40" />
                <p className="text-body-lg">Your cart is empty.</p>
                <button onClick={() => setCartOpen(false)} className="btn-ghost !py-2 !px-6">
                  <Link href="/shop">Shop Gear</Link>
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                  {remainingForFree > 0 && (
                    <p className="text-sm text-on-surface-variant bg-surface-container rounded p-3 border border-outline-variant/50">
                      Add <span className="text-primary-fixed font-bold">{formatMoney(remainingForFree)}</span>{" "}
                      more for free shipping.
                    </p>
                  )}
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex gap-4 bg-surface-container rounded border border-outline-variant/40 p-3"
                    >
                      <div className="relative w-20 h-20 bg-surface-container-highest rounded shrink-0 overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <Link
                            href={`/shop/${item.slug}`}
                            onClick={() => setCartOpen(false)}
                            className="text-body-md text-primary font-medium truncate hover:text-primary-fixed transition-colors"
                          >
                            {item.name}
                          </Link>
                          <button
                            aria-label="Remove item"
                            onClick={() => removeFromCart(item.productId, item.size)}
                            className="text-on-surface-variant hover:text-error transition-colors shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-on-surface-variant">Size: {item.size}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2 border border-outline-variant rounded">
                            <button
                              aria-label="Decrease quantity"
                              className="px-2 py-1 text-on-surface-variant hover:text-primary-fixed"
                              onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-body-md w-6 text-center">{item.quantity}</span>
                            <button
                              aria-label="Increase quantity"
                              className="px-2 py-1 text-on-surface-variant hover:text-primary-fixed"
                              onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="text-body-md text-primary-fixed font-bold">
                            {formatMoney(item.priceCents * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-outline-variant px-6 py-5 flex flex-col gap-2 bg-surface-container-lowest">
                  <Row label="Subtotal" value={formatMoney(subtotalCents)} />
                  <Row
                    label="Shipping"
                    value={shippingCents === 0 ? "FREE" : formatMoney(shippingCents)}
                    accent={shippingCents === 0}
                  />
                  <Row label="Estimated Tax" value={formatMoney(taxCents)} />
                  <div className="flex justify-between text-body-lg font-bold text-primary border-t border-outline-variant/50 pt-3 mt-1">
                    <span>Total</span>
                    <span className="text-primary-fixed">{formatMoney(totalCents)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="btn-primary text-center mt-3"
                  >
                    Secure Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-body-md">
      <span className="text-on-surface-variant">{label}</span>
      <span className={accent ? "text-primary-fixed font-bold" : "text-on-surface"}>{value}</span>
    </div>
  );
}
