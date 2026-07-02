"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";

const NAV_LINKS = [
  { label: "Men", href: "/shop?gender=Men" },
  { label: "Women", href: "/shop?gender=Women" },
  { label: "Accessories", href: "/shop?category=Accessories" },
  { label: "Shop All", href: "/shop" },
];

export default function Navbar() {
  const { cartCount, setCartOpen, user, setAuthOpen, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant">
      <div className="flex justify-between items-center h-20 px-4 md:px-12 w-full max-w-container mx-auto">
        <Link
          href="/"
          className="font-display text-headline-md tracking-tighter text-primary italic uppercase"
        >
          ApexVelocity
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-label-md uppercase text-on-surface-variant font-medium hover:text-primary-fixed transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-4 items-center text-primary-fixed">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="hover:text-primary transition-colors duration-200"
          >
            <Search size={22} />
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-label-md text-on-surface-variant max-w-[120px] truncate">
                {user.name}
              </span>
              <button
                aria-label="Log out"
                onClick={logout}
                className="hover:text-primary transition-colors duration-200"
                title="Log out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              aria-label="Account"
              onClick={() => setAuthOpen(true)}
              className="hover:text-primary transition-colors duration-200"
            >
              <User size={22} />
            </button>
          )}

          <button
            aria-label="Cart"
            onClick={() => setCartOpen(true)}
            className="relative hover:text-primary transition-colors duration-200"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary-container text-white text-[11px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>

          <button
            aria-label="Menu"
            className="md:hidden hover:text-primary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <form
          onSubmit={submitSearch}
          className="border-t border-outline-variant bg-surface-container-low px-4 md:px-12 py-3 max-w-container mx-auto flex gap-3"
        >
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gear — jackets, tights, footwear…"
            className="kinetic-input flex-1"
          />
          <button type="submit" className="btn-primary !py-2 !px-5">
            Go
          </button>
        </form>
      )}

      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface-container-low px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-label-md uppercase font-medium transition-colors ${
                pathname === link.href ? "text-primary-fixed" : "text-on-surface-variant"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="text-label-md uppercase text-on-surface-variant text-left"
            >
              Log out ({user.name})
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthOpen(true);
                setMobileOpen(false);
              }}
              className="text-label-md uppercase text-primary-fixed text-left"
            >
              Sign in / Register
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
