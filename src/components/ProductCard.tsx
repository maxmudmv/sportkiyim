"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, StarHalf } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatMoney } from "@/lib/money";
import type { ProductDTO } from "@/lib/types";

export default function ProductCard({ product }: { product: ProductDTO }) {
  const { addToCart } = useStore();

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl,
      size: defaultSize(product.sizes),
    });
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex flex-col bg-surface-container-high rounded overflow-hidden
        border border-outline-variant/50 hover:border-primary-fixed transition-colors duration-300"
    >
      <div className="relative h-80 overflow-hidden bg-surface-container-highest">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <div className="absolute top-4 right-4 bg-secondary-container text-white text-[12px] px-2 py-1 uppercase rounded-sm font-bold tracking-wider">
            {product.badge}
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-label-md uppercase tracking-widest text-on-surface-variant">
              Sold Out
            </span>
          </div>
        )}
        {product.inStock && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-surface-container-high via-surface-container-high/90 to-transparent">
            <button
              onClick={quickAdd}
              className="w-full py-3 bg-primary-fixed text-on-primary-fixed text-label-md uppercase rounded neon-glow-hover font-semibold"
            >
              Quick Add — {defaultSize(product.sizes)}
            </button>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-body-md text-primary font-medium">{product.name}</h3>
          <span className="text-body-md font-bold text-right shrink-0">
            {product.compareAtCents && (
              <span className="text-on-surface-variant line-through mr-2 font-normal text-sm">
                {formatMoney(product.compareAtCents)}
              </span>
            )}
            <span className="text-primary-fixed">{formatMoney(product.priceCents)}</span>
          </span>
        </div>
        <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-2">
          {product.category} · {product.sport}
        </p>
        <RatingRow rating={product.rating} count={product.reviewCount} />
      </div>
    </Link>
  );
}

function defaultSize(sizes: string[]): string {
  return sizes.includes("M") ? "M" : sizes[0];
}

export function RatingRow({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5 mt-auto pt-2 text-primary-fixed">
      {Array.from({ length: 5 }, (_, i) =>
        i < full ? (
          <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
        ) : i === full && half ? (
          <StarHalf key={i} size={15} fill="currentColor" strokeWidth={0} />
        ) : (
          <Star key={i} size={15} className="opacity-30" />
        ),
      )}
      <span className="text-on-surface-variant ml-2 text-xs">({count})</span>
    </div>
  );
}
