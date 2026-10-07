import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice, SLOGAN } from "@/lib/utils";
import PrintButton from "./PrintButton";

export const metadata = { title: "Order Invoice" };

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ new?: string; mail?: string }>;
}) {
  const { number } = await params;
  const sp = await searchParams;
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, number)).limit(1);
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  const statusIdx = ["pending", "confirmed", "shipped", "delivered"].indexOf(order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-14">
      {sp.new && (
        <div className="no-print mb-6 rounded-2xl bg-green-50 border border-green-200 p-5 text-center animate-fade-up">
          <div className="text-4xl">🎉</div>
          <h1 className="font-display text-2xl font-bold mt-2 text-green-800">Order Placed Successfully!</h1>
          <p className="text-sm text-green-800/80 mt-1">
            Thank you, {order.customerName}. {sp.mail ? `A confirmation email has been sent to ${order.email}.` : `Save this page as your invoice.`}
          </p>
        </div>
      )}

      {/* Progress */}
      {order.status !== "cancelled" && (
        <div className="no-print mb-8">
          <div className="flex items-center justify-between">
            {["Pending", "Confirmed", "Shipped", "Delivered"].map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center relative">
                {i > 0 && <div className={`absolute left-[-50%] right-[50%] top-3.5 h-0.5 ${i <= statusIdx ? "bg-gold" : "bg-black/10"}`} />}
                <div className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i <= statusIdx ? "bg-gold text-ink" : "bg-black/10 text-black/40"}`}>
                  {i < statusIdx ? "✓" : i + 1}
                </div>
                <span className="mt-1.5 text-[10px] sm:text-xs font-semibold">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice */}
      <div className="card overflow-hidden" id="invoice">
        <div className="bg-ink text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="h-12 w-12 rounded-xl" />
            <div>
              <div className="font-display text-xl tracking-[0.15em] uppercase">HammerHead</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-gold">{SLOGAN}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-white/50">Invoice</div>
            <div className="font-bold">{order.orderNumber}</div>
            <div className="text-xs text-white/60">{new Date(order.createdAt).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}</div>
          </div>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="label">Bill / Ship To</p>
            <p className="font-semibold">{order.customerName}</p>
            <p className="text-black/70">{order.address}</p>
            <p className="text-black/70">{order.city}, {order.province} {order.postalCode ?? ""}</p>
            <p className="text-black/70">📞 {order.phone}</p>
            <p className="text-black/70">✉ {order.email}</p>
          </div>
          <div className="sm:text-right">
            <p className="label">Payment</p>
            <p className="font-semibold">Cash on Delivery</p>
            <p className="label mt-3">Status</p>
            <span className="inline-block rounded-full bg-gold/15 text-gold-dark px-3 py-1 text-xs font-bold uppercase">{order.status}</span>
            {order.notes && (<><p className="label mt-3">Notes</p><p className="text-black/70">{order.notes}</p></>)}
          </div>
        </div>
        <div className="px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-black/10 text-left text-xs uppercase tracking-wider text-black/50">
                <th className="py-2.5">Item</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Price</th>
                <th className="py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-b border-black/5">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      {i.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={i.image} alt="" className="h-12 w-10 rounded object-cover no-print" />
                      )}
                      <div>
                        <p className="font-semibold">{i.name}</p>
                        <p className="text-xs text-black/50">Size {i.size}{i.color ? ` • ${i.color}` : ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">{i.quantity}</td>
                  <td className="py-3 text-right">{formatPrice(i.unitPrice)}</td>
                  <td className="py-3 text-right font-semibold">{formatPrice(i.unitPrice * i.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 flex justify-end">
          <dl className="w-full sm:w-64 space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-black/60">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-black/60">Shipping</dt><dd>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</dd></div>
            <div className="flex justify-between border-t border-black/10 pt-2 text-base font-bold"><dt>Total Due (COD)</dt><dd>{formatPrice(order.total)}</dd></div>
          </dl>
        </div>
        <div className="bg-sand px-6 py-4 text-[11px] text-black/55">
          7-day return / exchange policy from delivery date. No cash refunds — exchange or store credit only. Items must be unworn with tags attached.
        </div>
      </div>

      <div className="no-print mt-6 flex flex-wrap gap-3 justify-center">
        <PrintButton />
        <Link href="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}
