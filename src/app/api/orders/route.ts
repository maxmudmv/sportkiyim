import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { shippingFor, taxFor } from "@/lib/money";

type OrderItemInput = { productId: string; size: string; quantity: number };

/**
 * POST /api/orders — creates an order.
 * Prices are ALWAYS recomputed on the server from the database; the client
 * only sends product ids, sizes and quantities. Payment is mocked as an
 * immediate success ("PAID").
 */
export async function POST(req: NextRequest) {
  let body: {
    email?: string;
    fullName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    items?: OrderItemInput[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const fullName = body.fullName?.trim() ?? "";
  const address = body.address?.trim() ?? "";
  const city = body.city?.trim() ?? "";
  const postalCode = body.postalCode?.trim() ?? "";
  const country = body.country?.trim() ?? "";
  const items = body.items ?? [];

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  if (fullName.length < 2)
    return NextResponse.json({ error: "Full name is required" }, { status: 400 });
  if (address.length < 4)
    return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
  if (!city) return NextResponse.json({ error: "City is required" }, { status: 400 });
  if (!postalCode) return NextResponse.json({ error: "Postal code is required" }, { status: 400 });
  if (!country) return NextResponse.json({ error: "Country is required" }, { status: 400 });
  if (!items.length)
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });

  // Fetch authoritative product data.
  const ids = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  let subtotalCents = 0;
  const orderItems: { productId: string; name: string; size: string; quantity: number; unitCents: number }[] = [];

  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product)
      return NextResponse.json({ error: `Unknown product: ${item.productId}` }, { status: 400 });

    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 99)
      return NextResponse.json({ error: `Invalid quantity for ${product.name}` }, { status: 400 });

    if (!product.sizes.split(",").includes(item.size))
      return NextResponse.json(
        { error: `Size "${item.size}" is not available for ${product.name}` },
        { status: 400 },
      );

    if (product.stock < qty)
      return NextResponse.json(
        { error: `Only ${product.stock} left in stock for ${product.name}` },
        { status: 409 },
      );

    subtotalCents += product.priceCents * qty;
    orderItems.push({
      productId: product.id,
      name: product.name,
      size: item.size,
      quantity: qty,
      unitCents: product.priceCents,
    });
  }

  const shippingCents = shippingFor(subtotalCents);
  const taxCents = taxFor(subtotalCents);
  const totalCents = subtotalCents + shippingCents + taxCents;

  const user = await getSessionUser();

  // Mock payment gateway: always succeeds locally.
  const paymentApproved = true;
  if (!paymentApproved) {
    return NextResponse.json({ error: "Payment declined" }, { status: 402 });
  }

  const order = await prisma.$transaction(async (tx) => {
    // Decrement stock atomically; abort if anything oversells.
    for (const oi of orderItems) {
      const updated = await tx.product.updateMany({
        where: { id: oi.productId, stock: { gte: oi.quantity } },
        data: { stock: { decrement: oi.quantity } },
      });
      if (updated.count === 0) {
        throw new Error(`OUT_OF_STOCK:${oi.name}`);
      }
    }

    const created = await tx.order.create({
      data: {
        userId: user?.id ?? null,
        email,
        fullName,
        address,
        city,
        postalCode,
        country,
        subtotalCents,
        shippingCents,
        taxCents,
        totalCents,
        status: "PAID",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Clear the user's persisted cart after a successful order.
    if (user) await tx.cartItem.deleteMany({ where: { userId: user.id } });

    return created;
  }).catch((e: Error) => {
    if (e.message.startsWith("OUT_OF_STOCK:")) return e.message;
    throw e;
  });

  if (typeof order === "string") {
    return NextResponse.json(
      { error: `${order.replace("OUT_OF_STOCK:", "")} just sold out` },
      { status: 409 },
    );
  }

  return NextResponse.json(
    {
      order: {
        id: order.id,
        status: order.status,
        subtotalCents,
        shippingCents,
        taxCents,
        totalCents,
        items: order.items,
        createdAt: order.createdAt,
      },
    },
    { status: 201 },
  );
}

/** GET /api/orders — the logged-in user's order history. */
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
