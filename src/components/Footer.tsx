import Link from "next/link";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/shop" },
      { label: "Store Locator", href: "/shop" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Size Guide", href: "/shop" },
      { label: "Returns", href: "/shop" },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Privacy Policy", href: "/" }],
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant w-full py-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-12 max-w-container mx-auto">
        <div className="mb-8 md:mb-0">
          <Link
            href="/"
            className="font-display text-headline-md text-primary italic uppercase tracking-tighter mb-4 block hover:text-primary-fixed transition-colors"
          >
            ApexVelocity
          </Link>
          <p className="text-body-md text-on-surface-variant max-w-xs">
            Engineered for those who demand ultimate performance. Push boundaries, break records.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-4">
            <h4 className="text-label-md uppercase tracking-widest text-primary mb-2">
              {col.title}
            </h4>
            {col.links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-body-md text-on-surface-variant hover:text-primary transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <p className="text-body-md text-on-surface-variant/60 text-sm mt-12 px-4 md:px-12 max-w-container mx-auto">
        © {new Date().getFullYear()} ApexVelocity. Engineered for Performance.
      </p>
    </footer>
  );
}
