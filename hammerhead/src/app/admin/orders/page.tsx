import Link from "next/link";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatPrice, ORDER_STATUSES } from "@/lib/utils";
import StatusBadge from "../StatusBadge";
import { updateOrderStatus } from "../actions";

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const rows = await db
    .select()
    .from(orders)
    .where(status ? eq(orders.status, status) : undefined)
    .orderBy(desc(orders.createdAt));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Orders</h1>
          <p className="text-sm text-black/55">{rows.length} orders • all Cash on Delivery</p>
        </div>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          <Link href="/admin/orders" className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${!status ? "bg-ink text-white border-ink" : "border-black/10"}`}>All</Link>
          {ORDER_STATUSES.map((s) => (
            <Link key={s} href={`/admin/orders?status=${s}`} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${status === s ? "bg-ink text-white border-ink" : "border-black/10"}`}>{s}</Link>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {rows.length === 0 && <div className="card p-10 text-center text-sm text-black/50">No orders.</div>}
        {rows.map((o) => (
          <div key={o.id} className="card p-4 grid sm:grid-cols-[1fr_auto] gap-3 items-center">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/admin/orders/${o.id}`} className="font-bold hover:underline">{o.orderNumber}</Link>
                <p className="text-xs text-black/50">{new Date(o.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</p>
                <p className="text-sm mt-1">{o.customerName} • {o.phone}</p>
                <p className="text-xs text-black/50">{o.city}, {o.province} • {o.email}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatPrice(o.total)}</p>
                <StatusBadge status={o.status} />
                {o.emailSent && <p className="text-[10px] text-green-700 mt-1">✉ emailed</p>}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <form action={updateOrderStatus} className="flex gap-1.5">
                <input type="hidden" name="id" value={o.id} />
                <select name="status" defaultValue={o.status} className="input !py-1.5 !px-2 text-xs capitalize w-32">
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="rounded-lg bg-ink text-white px-3 py-1.5 text-xs font-bold">Update</button>
              </form>
              <Link href={`/admin/orders/${o.id}`} className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-bold">Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
