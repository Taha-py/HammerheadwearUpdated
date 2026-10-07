"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { BRAND, SLOGAN, formatPrice } from "@/lib/utils";
import CartDrawer from "./CartDrawer";

type Props = { user: { name: string; role: string } | null };

const NAV = [
  { href: "/shop?category=men", label: "Men" },
  { href: "/shop?category=women", label: "Women" },
  { href: "/shop?category=kids", label: "Kids" },
  { href: "/shop?style=casual", label: "Casual" },
  { href: "/shop?style=formal", label: "Formal" },
  { href: "/shop?sale=1", label: "Sale", accent: true },
];

export default function Header({ user }: Props) {
  const { count, setDrawerOpen, toast } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
  };

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink text-white text-[11px] sm:text-xs tracking-wider overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee py-1.5">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 gap-10 pr-10">
              <span>🚚 FREE DELIVERY ON ORDERS ABOVE {formatPrice(5000)}</span>
              <span className="text-gold">✦</span>
              <span>💵 CASH ON DELIVERY NATIONWIDE</span>
              <span className="text-gold">✦</span>
              <span>🔁 7-DAY EASY RETURNS</span>
              <span className="text-gold">✦</span>
              <span>🔥 UP TO 30% OFF SALE</span>
              <span className="text-gold">✦</span>
            </div>
          ))}
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "glass shadow-[0_4px_30px_-12px_rgba(0,0,0,0.25)]" : "bg-white"
        }`}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-3">
            {/* Left: menu (mobile) */}
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 6h18M3 12h18M3 18h12" strokeLinecap="round" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <span className="relative block h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-xl bg-ink shadow-lg ring-1 ring-gold/40 transition-transform duration-500 group-hover:rotate-[8deg]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="HammerHead logo" className="h-full w-full object-cover" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl sm:text-2xl font-bold tracking-[0.12em] uppercase">
                  {BRAND}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-gold-dark font-semibold mt-1">
                  {SLOGAN}
                </span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  className={`relative text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors hover:text-gold-dark after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-gold after:transition-all hover:after:w-full ${
                    n.accent ? "text-red-600" : ""
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5"
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
              </button>
              <Link
                href={user ? (user.role === "admin" ? "/admin" : "/account") : "/login"}
                aria-label="Account"
                className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5"
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                </svg>
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink"
                >
                  ⚙ Admin Panel
                </Link>
              )}
              <button
                aria-label="Cart"
                onClick={() => setDrawerOpen(true)}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5"
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 7h12l1 13H5L6 7Z" strokeLinejoin="round" />
                  <path d="M9 10V6a3 3 0 0 1 6 0v4" strokeLinecap="round" />
                </svg>
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink ring-2 ring-white">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <form onSubmit={submitSearch} className="pb-3 animate-fade-up">
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search jeans, shirts, blazers…"
                  className="input"
                />
                <button className="btn-primary !px-5">Go</button>
              </div>
            </form>
          )}
        </div>

        {/* Category quick strip (mobile) */}
        <div className="lg:hidden border-t border-black/5 bg-white/80">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-2">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                  n.accent ? "border-red-500 text-red-600" : "border-black/10 hover:border-ink"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile drawer menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-[84%] max-w-sm bg-ink text-white shadow-2xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="h-10 w-10 rounded-lg" />
              <div>
                <div className="font-display text-lg tracking-[0.15em] uppercase">{BRAND}</div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-gold">{SLOGAN}</div>
              </div>
            </div>
            <button onClick={() => setMenuOpen(false)} aria-label="Close" className="h-9 w-9 rounded-full hover:bg-white/10">
              ✕
            </button>
          </div>
          <nav className="flex flex-col p-3">
            {[
              { href: "/", label: "Home" },
              ...NAV,
              { href: "/shop", label: "All Products" },
              { href: "/policies", label: "Returns & Policies" },
              { href: "/contact", label: "Contact" },
            ].map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-white/5 ${
                  "accent" in n && n.accent ? "text-red-400" : ""
                }`}
              >
                {n.label}
                <span className="text-gold">›</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto p-5 border-t border-white/10 space-y-2">
            {user ? (
              <>
                <p className="text-xs text-white/60">Signed in as {user.name}</p>
                {user.role === "admin" && (
                  <Link href="/admin" className="btn-gold w-full">
                    ⚙ Admin Panel
                  </Link>
                )}
                <Link href="/account" className="btn-outline w-full !border-white/30 !text-white hover:!bg-white hover:!text-ink">
                  My Account
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-gold w-full">
                  Login
                </Link>
                <Link href="/register" className="btn-outline w-full !border-white/30 !text-white hover:!bg-white hover:!text-ink">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </aside>
      </div>

      <CartDrawer />

      {/* Toast */}
      <div
        className={`fixed left-1/2 top-24 z-[60] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-2xl ring-1 ring-gold/50 transition-all duration-300 ${
          toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        {toast}
      </div>
    </>
  );
}
