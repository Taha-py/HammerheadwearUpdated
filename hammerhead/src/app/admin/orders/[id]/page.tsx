import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice, ORDER_STATUSES } from "@/lib/utils";
import StatusBadge from "../../StatusBadge";
import { updateOrderStatus } from "../../actions";

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [o] = await db.select().from(orders).where(eq(orders.id, Number(id))).limit(1);
  if (!o) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));

  return (
    <div className="max-w-4xl">
      <Link href="/admin/orders" className="text-xs font-bold underline">← All orders</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">{o.orderNumber}</h1>
          <p className="text-sm text-black/55">{new Date(o.createdAt).toLocaleString("en-PK", { dateStyle: "long", timeStyle: "short" })}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={o.status} />
          <Link href={`/order/${o.orderNumber}`} target="_blank" className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-bold">Invoice</Link>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 card p-5">
          <h2 className="font-semibold mb-3">Items</h2>
          <div className="divide-y divide-black/5">
            {items.map((i) => (
              <div key={i.id} className="flex items-center gap-3 py-3 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {i.image && <img src={i.image} alt="" className="h-14 w-12 rounded-lg object-cover" />}
                <div className="flex-1">
                  <p className="font-semibold">{i.name}</p>
                  <p className="text-xs text-black/50">Size {i.size}{i.color ? ` • ${i.color}` : ""} • Qty {i.quantity}</p>
                </div>
                <p className="font-bold">{formatPrice(i.unitPrice * i.quantity)}</p>
              </div>
            ))}
          </div>
          <dl className="mt-4 border-t border-black/10 pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(o.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{o.shipping === 0 ? "FREE" : formatPrice(o.shipping)}</dd></div>
            <div className="flex justify-between font-bold text-base"><dt>Total to collect (COD)</dt><dd>{formatPrice(o.total)}</dd></div>
          </dl>
        </div>
        <div className="space-y-5">
          <div className="card p-5 text-sm">
            <h2 className="font-semibold mb-3">Customer</h2>
            <p className="font-semibold">{o.customerName}</p>
            <p><a href={`tel:${o.phone}`} className="underline">{o.phone}</a></p>
            <p><a href={`mailto:${o.email}`} className="underline break-all">{o.email}</a></p>
            <p className="mt-3 text-black/70">{o.address}<br />{o.city}, {o.province} {o.postalCode}</p>
            {o.notes && <p className="mt-3 rounded-lg bg-sand p-2 text-xs">📝 {o.notes}</p>}
            <a href={`https://wa.me/${o.phone.replace(/[^0-9]/g, "").replace(/^0/, "92")}`} target="_blank" className="mt-4 inline-flex items-center gap-1 rounded-full bg-green-600 text-white px-3 py-1.5 text-xs font-bold">WhatsApp customer</a>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold mb-3">Update Status</h2>
            <form action={updateOrderStatus} className="space-y-2">
              <input type="hidden" name="id" value={o.id} />
              <select name="status" defaultValue={o.status} className="input capitalize">
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn-primary w-full !py-2.5">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
