"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

export default function MobileNav({ loggedIn, isAdmin }: { loggedIn: boolean; isAdmin: boolean }) {
  const pathname = usePathname();
  const { count, setDrawerOpen } = useCart();
  if (pathname?.startsWith("/admin")) return null;

  const items = [
    { href: "/", label: "Home", icon: "M3 11 12 3l9 8v10h-6v-6H9v6H3z" },
    { href: "/shop", label: "Shop", icon: "M4 7h16l-1.5 12h-13z M9 7V5a3 3 0 0 1 6 0v2" },
    { href: "/shop?sale=1", label: "Sale", icon: "M20 12 12 20 4 12V4h8z M8 8h.01" },
    { href: loggedIn ? (isAdmin ? "/admin" : "/account") : "/login", label: isAdmin ? "Admin" : "Account", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 3.6-7 8-7s8 3 8 7" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-black/5 safe-bottom no-print">
      <div className="grid grid-cols-5">
        {items.slice(0, 2).map((it) => (
          <NavLink key={it.label} {...it} active={pathname === it.href} />
        ))}
        <button onClick={() => setDrawerOpen(true)} className="relative flex flex-col items-center justify-center py-2">
          <span className="flex h-11 w-11 -mt-6 items-center justify-center rounded-full bg-ink text-white shadow-xl ring-4 ring-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 7h12l1 13H5L6 7Z" strokeLinejoin="round" />
              <path d="M9 10V6a3 3 0 0 1 6 0v4" strokeLinecap="round" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-7 right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </span>
          <span className="text-[10px] font-semibold mt-1">Bag</span>
        </button>
        {items.slice(2).map((it) => (
          <NavLink key={it.label} {...it} active={pathname === it.href.split("?")[0] && it.href !== "/shop?sale=1"} />
        ))}
      </div>
    </nav>
  );
}

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center py-2 ${active ? "text-gold-dark" : "text-black/70"}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        <path d={icon} />
      </svg>
      <span className="text-[10px] font-semibold mt-0.5">{label}</span>
    </Link>
  );
}
