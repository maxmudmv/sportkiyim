import { Suspense } from "react";
import ShopClient from "@/components/ShopClient";

export const metadata = { title: "Shop All — ApexVelocity" };

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-container mx-auto px-4 md:px-12 py-24 text-on-surface-variant">
          Loading gear…
        </div>
      }
    >
      <ShopClient />
    </Suspense>
  );
}
