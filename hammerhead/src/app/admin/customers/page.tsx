import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { count, desc, eq, sum } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";

export default async function AdminCustomers() {
  const customers = await db.select().from(users).where(eq(users.role, "customer")).orderBy(desc(users.createdAt));
  const stats = await db
    .select({ email: orders.email, n: count(), total: sum(orders.total) })
    .from(orders)
    .groupBy(orders.email);
  const byEmail = new Map(stats.map((s) => [s.email, s]));
  // guest customers (from orders only)
  const guestEmails = stats.filter((s) => !customers.some((c) => c.email === s.email));

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">Customers</h1>
      <p className="text-sm text-black/55 mb-6">{customers.length} registered • {guestEmails.length} guest buyers</p>
      <div className="card overflow-hidden">
        <div className="divide-y divide-black/5">
          {customers.map((c) => {
            const s = byEmail.get(c.email);
            return (
              <div key={c.id} className="flex items-center justify-between gap-3 p-4 text-sm">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-black/50">{c.email}{c.phone ? ` • ${c.phone}` : ""}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatPrice(Number(s?.total ?? 0))}</p>
                  <p className="text-xs text-black/50">{s?.n ?? 0} orders</p>
                </div>
              </div>
            );
          })}
          {guestEmails.map((g) => (
            <div key={g.email} className="flex items-center justify-between gap-3 p-4 text-sm bg-sand/40">
              <div>
                <p className="font-semibold">{g.email}</p>
                <p className="text-xs text-black/50">Guest checkout</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatPrice(Number(g.total ?? 0))}</p>
                <p className="text-xs text-black/50">{g.n} orders</p>
              </div>
            </div>
          ))}
          {customers.length + guestEmails.length === 0 && <p className="p-10 text-center text-sm text-black/50">No customers yet.</p>}
        </div>
      </div>
    </div>
  );
}
