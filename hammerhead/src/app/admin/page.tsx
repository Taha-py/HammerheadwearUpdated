import Link from "next/link";
import { db } from "@/db";
import { orderItems, orders, products, users } from "@/db/schema";
import { formatPrice } from "@/lib/utils";
import { count, desc, eq, sql, sum } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import StatusBadge from "./StatusBadge";

export default async function AdminDashboard() {
  await ensureSeeded();
  const [[pc], [oc], [uc], [rev], [low], recent, top] = await Promise.all([
    db.select({ n: count() }).from(products),
    db.select({ n: count() }).from(orders),
    db.select({ n: count() }).from(users).where(eq(users.role, "customer")),
    db.select({ s: sum(orders.total) }).from(orders).where(sql`${orders.status} <> 'cancelled'`),
    db.select({ n: count() }).from(products).where(sql`${products.stock} <= 5`),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(6),
    db
      .select({ name: orderItems.name, qty: sum(orderItems.quantity) })
      .from(orderItems)
      .groupBy(orderItems.name)
      .orderBy(desc(sum(orderItems.quantity)))
      .limit(5),
  ]);
  const pending = await db.select({ n: count() }).from(orders).where(eq(orders.status, "pending"));

  const stats = [
    { label: "Total Revenue", value: formatPrice(Number(rev?.s ?? 0)), icon: "💰", tone: "bg-ink text-white" },
    { label: "Orders", value: String(oc.n), sub: `${pending[0].n} pending`, icon: "📦", href: "/admin/orders" },
    { label: "Products", value: String(pc.n), sub: `${low.n} low / out of stock`, icon: "👕", href: "/admin/products" },
    { label: "Customers", value: String(uc.n), icon: "👥", href: "/admin/customers" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-black/55">Overview of your store.</p>
        </div>
        <Link href="/admin/products/new" className="btn-gold !py-2.5">+ Add Product</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href ?? "/admin"} className={`card p-4 sm:p-6 ${s.tone ?? ""}`}>
            <div className="text-2xl">{s.icon}</div>
            <div className="mt-3 text-xl sm:text-2xl font-bold">{s.value}</div>
            <div className={`text-xs ${s.tone ? "text-white/60" : "text-black/50"}`}>{s.label}</div>
            {s.sub && <div className="text-[11px] mt-1 text-gold-dark font-semibold">{s.sub}</div>}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold underline">View all</Link>
          </div>
          <div className="divide-y divide-black/5">
            {recent.length === 0 && <p className="text-sm text-black/50 py-6 text-center">No orders yet.</p>}
            {recent.map((o) => (
              <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between py-3 text-sm hover:bg-sand/60 -mx-2 px-2 rounded-lg">
                <div>
                  <p className="font-semibold">{o.orderNumber}</p>
                  <p className="text-xs text-black/50">{o.customerName} • {o.city}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatPrice(o.total)}</p>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Top Sellers</h2>
          {top.length === 0 && <p className="text-sm text-black/50">No sales yet.</p>}
          <ul className="space-y-3">
            {top.map((t, i) => (
              <li key={t.name} className="flex items-center gap-3 text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-gold-dark font-bold text-xs">{i + 1}</span>
                <span className="flex-1 line-clamp-1">{t.name}</span>
                <span className="font-bold">{t.qty} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


