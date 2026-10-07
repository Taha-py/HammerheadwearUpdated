import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "../(auth)/actions";
import AdminNav from "./AdminNav";

export const metadata = { title: "Admin Panel" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/account");

  return (
    <div className="min-h-screen bg-[#f3f2ee] lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:flex flex-col bg-ink text-white sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-11 w-11 rounded-xl ring-1 ring-gold/40" />
          <div>
            <div className="font-display tracking-[0.15em] uppercase">HammerHead</div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-gold">Admin Panel</div>
          </div>
        </div>
        <AdminNav />
        <div className="mt-auto p-5 border-t border-white/10 text-xs">
          <p className="text-white/50">Signed in as</p>
          <p className="font-semibold truncate">{user.email}</p>
          <div className="mt-3 flex gap-2">
            <Link href="/" className="flex-1 rounded-lg border border-white/20 py-2 text-center hover:bg-white/10">View Store</Link>
            <form action={logoutAction} className="flex-1"><button className="w-full rounded-lg bg-gold text-ink font-bold py-2">Logout</button></form>
          </div>
        </div>
      </aside>

      <div className="flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-ink text-white">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="h-8 w-8 rounded-lg" />
              <span className="font-display tracking-[0.15em] uppercase text-sm">Admin</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Link href="/" className="rounded-full border border-white/20 px-3 py-1.5">Store</Link>
              <form action={logoutAction}><button className="rounded-full bg-gold text-ink font-bold px-3 py-1.5">Logout</button></form>
            </div>
          </div>
          <AdminNav mobile />
        </header>
        <div className="flex-1 p-4 sm:p-6 lg:p-10 pb-24">{children}</div>
      </div>
    </div>
  );
}
