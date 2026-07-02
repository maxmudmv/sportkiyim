"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { ProductDTO } from "@/lib/types";

const CATEGORIES = ["Jackets", "Tights", "Shorts", "Tops", "Pants", "Footwear", "Accessories"];
const SPORTS = ["Running", "Training", "Cycling", "Outdoor", "Recovery"];
const GENDERS = ["Men", "Women", "Unisex"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function ShopClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);

  // Filter state derives from the URL so links like /shop?gender=Men work.
  const selected = {
    category: searchParams.get("category")?.split(",").filter(Boolean) ?? [],
    sport: searchParams.get("sport")?.split(",").filter(Boolean) ?? [],
    gender: searchParams.get("gender")?.split(",").filter(Boolean) ?? [],
    size: searchParams.get("size") ?? "",
    sort: searchParams.get("sort") ?? "recommended",
    q: searchParams.get("q") ?? "",
  };

  const updateParams = useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      router.replace(`/shop?${next.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const toggleCsv = (key: "category" | "sport" | "gender", value: string) => {
    const current = new Set(selected[key]);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    updateParams({ [key]: [...current].join(",") });
  };

  // Server-side filtering: every change re-queries /api/products.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/products?${searchParams.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setLoading(false);
      });
    return () => controller.abort();
  }, [searchParams]);

  const activeCount =
    selected.category.length + selected.sport.length + selected.gender.length + (selected.size ? 1 : 0);

  const filtersPanel = (
    <div className="flex flex-col gap-8">
      <FilterGroup
        title="Category"
        options={CATEGORIES}
        selected={selected.category}
        onToggle={(v) => toggleCsv("category", v)}
      />
      <FilterGroup
        title="Sport"
        options={SPORTS}
        selected={selected.sport}
        onToggle={(v) => toggleCsv("sport", v)}
      />
      <FilterGroup
        title="Gender"
        options={GENDERS}
        selected={selected.gender}
        onToggle={(v) => toggleCsv("gender", v)}
      />
      <div>
        <h3 className="text-label-md uppercase tracking-widest text-primary mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => updateParams({ size: selected.size === size ? "" : size })}
              className={`min-w-[44px] px-3 py-2 rounded border text-sm transition-colors ${
                selected.size === size
                  ? "border-primary-fixed text-on-primary-fixed bg-primary-fixed font-bold"
                  : "border-outline-variant text-on-surface-variant hover:border-primary-fixed hover:text-primary-fixed"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      {activeCount > 0 && (
        <button
          onClick={() => updateParams({ category: "", sport: "", gender: "", size: "", q: "" })}
          className="text-label-md uppercase text-secondary-container hover:text-primary-fixed transition-colors text-left"
        >
          Clear all filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-container mx-auto px-4 md:px-12 py-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-10">
        <div>
          <h1 className="section-title">Shop All</h1>
          {selected.q && (
            <p className="text-on-surface-variant mt-3">
              Results for “<span className="text-primary-fixed">{selected.q}</span>”
              <button
                onClick={() => updateParams({ q: "" })}
                className="ml-2 text-sm underline hover:text-primary-fixed"
              >
                clear
              </button>
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden flex items-center gap-2 border border-outline-variant rounded px-4 py-2 text-label-md uppercase text-on-surface-variant"
            onClick={() => setMobileFilters(true)}
          >
            <SlidersHorizontal size={16} /> Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          <label className="flex items-center gap-2 text-label-md text-on-surface-variant uppercase">
            Sort by
            <select
              value={selected.sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="bg-surface-container border border-outline-variant rounded px-3 py-2 text-on-surface focus:border-primary-fixed focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        <aside className="hidden lg:block">{filtersPanel}</aside>

        {/* Mobile slide-up filter sheet (Telegram-style bottom sheet) */}
        <AnimatePresence>
          {mobileFilters && (
            <div className="fixed inset-0 z-[60] lg:hidden">
              <motion.div
                className="absolute inset-0 bg-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileFilters(false)}
              />
              <motion.div
                className="absolute inset-x-0 bottom-0 max-h-[82vh] bg-surface-container-low
                  border-t border-outline-variant rounded-t-xl overflow-y-auto pb-24"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              >
                <div className="sticky top-0 bg-surface-container-low pt-3 pb-4 px-6 border-b border-outline-variant/50 z-10">
                  <div className="w-10 h-1 rounded-full bg-outline-variant mx-auto mb-4" />
                  <div className="flex justify-between items-center">
                    <h2 className="font-display text-headline-md text-primary uppercase">Filters</h2>
                    <button onClick={() => setMobileFilters(false)} aria-label="Close filters">
                      <X size={22} className="text-on-surface-variant" />
                    </button>
                  </div>
                </div>
                <div className="p-6">{filtersPanel}</div>
                <div className="fixed inset-x-0 bottom-0 p-4 bg-surface-container-lowest border-t border-outline-variant">
                  <button onClick={() => setMobileFilters(false)} className="btn-primary w-full">
                    Show {products.length} Results
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-[420px] rounded bg-surface-container animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center text-on-surface-variant">
              <p className="text-body-lg mb-4">No gear matches those filters.</p>
              <button
                onClick={() => updateParams({ category: "", sport: "", gender: "", size: "", q: "" })}
                className="btn-ghost"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-on-surface-variant mb-4">{products.length} products</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="text-label-md uppercase tracking-widest text-primary mb-4">{title}</h3>
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="w-4 h-4 rounded-sm border-outline-variant bg-surface-container
                text-primary-fixed focus:ring-primary-fixed focus:ring-offset-0 accent-[#c3f400]"
            />
            <span
              className={`text-body-md transition-colors ${
                selected.includes(option)
                  ? "text-primary-fixed"
                  : "text-on-surface-variant group-hover:text-primary"
              }`}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
