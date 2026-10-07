"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "👕" },
  { href: "/admin/products/new", label: "Add Product", icon: "➕" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
];

export default function AdminNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const isActive = (h: string) => (h === "/admin" ? pathname === h : pathname === h || (pathname.startsWith(h) && h !== "/admin/products/new" && !(h === "/admin/products" && pathname === "/admin/products/new")));

  if (mobile) {
    return (
      <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${isActive(l.href) ? "bg-gold text-ink" : "bg-white/10"}`}>
            {l.icon} {l.label}
          </Link>
        ))}
      </nav>
    );
  }
  return (
    <nav className="p-3 space-y-1">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive(l.href) ? "bg-gold text-ink" : "hover:bg-white/5 text-white/80"}`}>
          <span>{l.icon}</span> {l.label}
        </Link>
      ))}
    </nav>
  );
}
