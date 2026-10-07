import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { desc, eq, or } from "drizzle-orm";
import { logoutAction } from "../(auth)/actions";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  const myOrders = await db
    .select()
    .from(orders)
    .where(or(eq(orders.userId, user.id), eq(orders.email, user.email)))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-dark font-bold">My Account</p>
          <h1 className="font-display text-3xl font-bold mt-1">Hello, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-black/55">{user.email}</p>
        </div>
        <div className="flex gap-2">
          {user.role === "admin" && <Link href="/admin" className="btn-gold !py-2.5">⚙ Admin Panel</Link>}
          <form action={logoutAction}><button className="btn-outline !py-2.5">Logout</button></form>
        </div>
      </div>

      <h2 className="font-semibold text-lg mt-10 mb-4">Order History</h2>
      {myOrders.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-black/60">No orders yet.</p>
          <Link href="/shop" className="btn-primary mt-4">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {myOrders.map((o) => (
            <Link key={o.id} href={`/order/${o.orderNumber}`} className="card p-4 flex items-center justify-between gap-3 hover:border-gold transition">
              <div>
                <p className="font-bold">{o.orderNumber}</p>
                <p className="text-xs text-black/50">{new Date(o.createdAt).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })} • COD</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatPrice(o.total)}</p>
                <span className="inline-block rounded-full bg-gold/15 text-gold-dark px-2.5 py-0.5 text-[10px] font-bold uppercase">{o.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
