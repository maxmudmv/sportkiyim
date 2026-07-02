import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import WelcomeBanner from "@/components/WelcomeBanner";

const IMG = "https://lh3.googleusercontent.com/aida-public/";

const CATEGORIES = [
  {
    title: "Men's Apparel",
    href: "/shop?gender=Men",
    image: `${IMG}AB6AXuCaHRXnwDxXfFb3RyczT1blglcN-diPJKBoj0f2WBP2iFRIdU85pPNepNuQUmQUaAqDheSbui3g8WG_FGCJ9Xlt-6LxgKw206AwrlFReym7VHoqUjgqC1cSr9CnZT3mgW_Zo6IXe7eAr83rvVAdq3IDfSiHz37xEMHESQwJtdYZKycNQtBbH78s5-kD9HEBkcyPHU3mvPG5ZFaiheaMte59ZAZqi4ovzfbhmnfffuPk66PhCaVnoOy6eUAsRtP3QrQ5E2Cv1Ss7ySqh`,
    large: true,
  },
  {
    title: "Women's Apparel",
    href: "/shop?gender=Women",
    image: `${IMG}AB6AXuB3kWQk1tvnzVBPhsMbNeSXG-rwEax37rugX7JtNOKPod6qE03NktJXFnX6QvMANiCM583LMSnn9lFxYF47P68nIc2igwcWqNEqwLx9GKAO1Qp6yCfzx6GEwWQr1HIuvhS4mri78pMDExS9lHZw9FIhmbe-95Yqe-qyAQKpEzgX_bdxE5CiRiyU1luK-QDb38eeJUCMu2EgjYf3ispH-Gaggkq3kYO6k1SfRHy3PM_kPi8PC42_hChUxeD1QkSu5QyWjyfHJ1o1j0Zw`,
    large: false,
  },
  {
    title: "Technical Gear",
    href: "/shop?category=Accessories,Footwear",
    image: `${IMG}AB6AXuCuiyXR6kJCmkGWpTkiPglnGVMJjFt_RECbM5wjqzMXlrJYywQ1b0jLG5KLOieiTrCvH0UCU8VXgV3r1_fte2fs1mE0biPcj5CwkFAbSP0NFsxhW5wQ6HVJxwSSWkky5rDLjDQYnXQjANhQjdXrpNjSyr33cjTkOtzjV7v6ReivMiwBfwFtnu8NaeuDu8cgqlj3mZesGOdzF99CnWYKCzdu1RH1juNn5jYrxP_kLq-0rGiNxKMdGlqa-n6dOqvLuYUSBRdqXSZQSus8`,
    large: false,
  },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const trending = await prisma.product.findMany({
    orderBy: { reviewCount: "desc" },
    take: 4,
  });

  return (
    <>
      <WelcomeBanner />
      <Hero />

      {/* Categories */}
      <section className="py-24 px-4 md:px-12 max-w-container mx-auto">
        <h2 className="section-title mb-12">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className={`relative group overflow-hidden rounded bg-surface-container-high min-h-[300px] ${
                cat.large ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700
                  group-hover:scale-105 opacity-60 group-hover:opacity-80"
                style={{ backgroundImage: `url('${cat.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="font-display text-headline-md text-primary uppercase mb-2">
                  {cat.title}
                </h3>
                <span className="inline-flex items-center gap-2 text-label-md uppercase text-primary-fixed group-hover:text-primary transition-colors">
                  Shop Now <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="py-24 px-4 md:px-12 max-w-container mx-auto border-t border-outline-variant/30">
        <div className="flex justify-between items-end mb-12">
          <h2 className="section-title">Trending Now</h2>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-label-md uppercase text-on-surface-variant hover:text-primary-fixed transition-colors"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((p) => (
            <ProductCard key={p.id} product={toProductDTO(p)} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop" className="btn-ghost block">
            View All Products
          </Link>
        </div>
      </section>
    </>
  );
}
