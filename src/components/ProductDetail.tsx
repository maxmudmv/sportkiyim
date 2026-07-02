"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Minus, Plus, ShieldCheck, Truck, Zap } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatMoney } from "@/lib/money";
import { RatingRow } from "@/components/ProductCard";
import type { ProductDTO } from "@/lib/types";

export default function ProductDetail({ product }: { product: ProductDTO }) {
  const { addToCart } = useStore();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("specs");

  const add = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
        size,
      },
      qty,
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Gallery */}
      <div className="relative aspect-square bg-surface-container-highest rounded overflow-hidden border border-outline-variant/40">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        {product.badge && (
          <div className="absolute top-4 left-4 bg-secondary-container text-white text-[12px] px-3 py-1.5 uppercase rounded-sm font-bold tracking-wider">
            {product.badge}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-6">
        <div>
          <nav className="text-sm text-on-surface-variant mb-3">
            <Link href="/shop" className="hover:text-primary-fixed transition-colors">
              Shop
            </Link>
            {" / "}
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-primary-fixed transition-colors"
            >
              {product.category}
            </Link>
          </nav>
          <p className="text-label-md uppercase tracking-widest text-primary-fixed mb-2">
            {product.sport} · Elite Series
          </p>
          <h1 className="font-display text-headline-lg text-primary uppercase tracking-tight">
            {product.name}
          </h1>
          <div className="mt-2">
            <RatingRow rating={product.rating} count={product.reviewCount} />
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-headline-md font-display text-primary-fixed font-bold">
            {formatMoney(product.priceCents)}
          </span>
          {product.compareAtCents && (
            <span className="text-body-lg text-on-surface-variant line-through">
              {formatMoney(product.compareAtCents)}
            </span>
          )}
        </div>

        <p className="text-body-md text-on-surface-variant">{product.description}</p>

        {/* Color variant */}
        <div>
          <h3 className="text-label-md uppercase tracking-widest text-primary mb-3">
            Color: <span className="text-on-surface-variant">{color}</span>
          </h3>
          <div className="flex gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-4 py-2 rounded border text-sm transition-colors ${
                  color === c
                    ? "border-primary-fixed text-primary-fixed"
                    : "border-outline-variant text-on-surface-variant hover:border-primary-fixed"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Size variant */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-label-md uppercase tracking-widest text-primary">Size</h3>
            {sizeError && <span className="text-error text-sm">Select a size first</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSize(s);
                  setSizeError(false);
                }}
                className={`min-w-[52px] px-4 py-3 rounded border text-sm font-semibold transition-all ${
                  size === s
                    ? "border-primary-fixed bg-primary-fixed text-on-primary-fixed shadow-neon"
                    : sizeError
                      ? "border-error text-on-surface-variant"
                      : "border-outline-variant text-on-surface-variant hover:border-primary-fixed hover:text-primary-fixed"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Qty + Add */}
        <div className="flex gap-4 items-stretch">
          <div className="flex items-center border border-outline-variant rounded">
            <button
              aria-label="Decrease quantity"
              className="px-4 py-3 text-on-surface-variant hover:text-primary-fixed"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center text-body-md">{qty}</span>
            <button
              aria-label="Increase quantity"
              className="px-4 py-3 text-on-surface-variant hover:text-primary-fixed"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
            >
              <Plus size={16} />
            </button>
          </div>
          <button onClick={add} disabled={!product.inStock} className="btn-primary flex-1">
            {product.inStock ? "Add to Cart" : "Sold Out"}
          </button>
        </div>

        <p className="text-sm text-on-surface-variant">
          {product.stock > 0 && product.stock <= 20 ? (
            <span className="text-secondary-container font-semibold">
              Only {product.stock} left in stock
            </span>
          ) : (
            <span>In stock and ready to ship</span>
          )}
        </p>

        {/* Trust row */}
        <div className="grid grid-cols-3 gap-3 border-y border-outline-variant/40 py-4 text-center">
          <Trust icon={<Truck size={18} />} label="Free ship over $150" />
          <Trust icon={<ShieldCheck size={18} />} label="60-day returns" />
          <Trust icon={<Zap size={18} />} label="Performance tested" />
        </div>

        {/* Accordions */}
        <Accordion
          id="specs"
          title="Technical Specs"
          open={openSection === "specs"}
          onToggle={() => setOpenSection(openSection === "specs" ? null : "specs")}
        >
          <table className="w-full text-body-md">
            <tbody>
              {product.specs.map((row) => (
                <tr key={row.label} className="border-b border-outline-variant/30 last:border-0">
                  <td className="py-2 pr-4 text-on-surface-variant whitespace-nowrap align-top">
                    {row.label}
                  </td>
                  <td className="py-2 text-on-surface">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Accordion>
        <Accordion
          id="shipping"
          title="Shipping & Returns"
          open={openSection === "shipping"}
          onToggle={() => setOpenSection(openSection === "shipping" ? null : "shipping")}
        >
          <p className="text-body-md text-on-surface-variant">
            Orders over $150 ship free. Standard delivery takes 2–4 business days. Unworn gear can
            be returned within 60 days for a full refund — no questions, no friction.
          </p>
        </Accordion>
      </div>
    </div>
  );
}

function Trust({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-on-surface-variant">
      <span className="text-primary-fixed">{icon}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

function Accordion({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-outline-variant/40 rounded bg-surface-container-low">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`accordion-${id}`}
        className="w-full flex justify-between items-center px-5 py-4 text-label-md uppercase tracking-widest text-primary"
      >
        {title}
        <ChevronDown
          size={18}
          className={`text-primary-fixed transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div id={`accordion-${id}`} className="px-5 pb-5">
          {children}
        </div>
      )}
    </div>
  );
}
