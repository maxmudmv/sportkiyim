import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/types";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      OR: [{ category: product.category }, { sport: product.sport }],
    },
    orderBy: { rating: "desc" },
    take: 4,
  });

  return (
    <div className="max-w-container mx-auto px-4 md:px-12 py-12">
      <ProductDetail product={toProductDTO(product)} />

      {related.length > 0 && (
        <section className="mt-24 border-t border-outline-variant/30 pt-16">
          <h2 className="section-title mb-12">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={toProductDTO(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
