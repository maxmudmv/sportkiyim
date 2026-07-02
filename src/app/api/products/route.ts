import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/products
 * Query params:
 *   category — filter by category (comma-separated for multiple)
 *   sport    — filter by sport (comma-separated)
 *   gender   — filter by gender
 *   size     — only products offering this size
 *   q        — text search in name/description
 *   maxPrice — max price in whole dollars
 *   sort     — "newest" | "price-asc" | "price-desc" | "rating" | "recommended"
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const csv = (key: string) =>
    sp.get(key)?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  const where: Prisma.ProductWhereInput = {};

  const categories = csv("category");
  if (categories.length) where.category = { in: categories };

  const sports = csv("sport");
  if (sports.length) where.sport = { in: sports };

  const genders = csv("gender");
  if (genders.length) where.gender = { in: genders };

  const size = sp.get("size");
  if (size) where.sizes = { contains: size };

  const q = sp.get("q");
  if (q) {
    where.OR = [{ name: { contains: q } }, { description: { contains: q } }];
  }

  const maxPrice = Number(sp.get("maxPrice"));
  if (Number.isFinite(maxPrice) && maxPrice > 0) {
    where.priceCents = { lte: Math.round(maxPrice * 100) };
  }

  const sort = sp.get("sort") ?? "recommended";
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "newest"
      ? { createdAt: "desc" }
      : sort === "price-asc"
        ? { priceCents: "asc" }
        : sort === "price-desc"
          ? { priceCents: "desc" }
          : sort === "rating"
            ? { rating: "desc" }
            : { reviewCount: "desc" }; // "recommended"

  const products = await prisma.product.findMany({ where, orderBy });

  return NextResponse.json({
    count: products.length,
    products: products.map((p) => ({
      ...p,
      sizes: p.sizes.split(","),
      colors: p.colors.split(","),
      specs: JSON.parse(p.specs),
      inStock: p.stock > 0,
    })),
  });
}
