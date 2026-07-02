export type Spec = { label: string; value: string };

/** Product as returned by the API / passed to client components. */
export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  description: string;
  specs: Spec[];
  priceCents: number;
  compareAtCents: number | null;
  category: string;
  sport: string;
  gender: string;
  sizes: string[];
  colors: string[];
  imageUrl: string;
  badge: string | null;
  stock: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
};

/** Converts a raw Prisma Product row to the serializable DTO. */
export function toProductDTO(p: {
  id: string;
  slug: string;
  name: string;
  description: string;
  specs: string;
  priceCents: number;
  compareAtCents: number | null;
  category: string;
  sport: string;
  gender: string;
  sizes: string;
  colors: string;
  imageUrl: string;
  badge: string | null;
  stock: number;
  rating: number;
  reviewCount: number;
}): ProductDTO {
  return {
    ...p,
    sizes: p.sizes.split(","),
    colors: p.colors.split(","),
    specs: JSON.parse(p.specs),
    inStock: p.stock > 0,
  };
}
