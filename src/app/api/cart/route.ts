import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

/** GET /api/cart — the logged-in user's persisted cart. */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ items: [] });

  const items = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    items: items.map((i) => ({
      productId: i.productId,
      slug: i.product.slug,
      name: i.product.name,
      priceCents: i.product.priceCents,
      imageUrl: i.product.imageUrl,
      size: i.size,
      quantity: i.quantity,
    })),
  });
}

/** PUT /api/cart — replace the persisted cart with the client's snapshot. */
export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { items?: { productId: string; size: string; quantity: number }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const items = (body.items ?? []).filter(
    (i) => i.productId && i.size && Number.isInteger(i.quantity) && i.quantity > 0,
  );

  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { userId: user.id } }),
    ...items.map((i) =>
      prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: i.productId,
          size: i.size,
          quantity: Math.min(i.quantity, 99),
        },
      }),
    ),
  ]);

  return NextResponse.json({ ok: true, count: items.length });
}
