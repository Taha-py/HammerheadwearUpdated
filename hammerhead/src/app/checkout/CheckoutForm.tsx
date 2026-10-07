"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatPrice, FREE_SHIPPING_OVER, SHIPPING_FEE } from "@/lib/utils";
import { placeOrder } from "./actions";

const PROVINCES = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Kashmir"];

export default function CheckoutForm({ user }: { user: { name: string; email: string; phone: string } | null }) {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: "",
    city: "",
    province: "Punjab",
    postalCode: "",
    notes: "",
  });
  const shipping = subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await placeOrder({
        customer: form,
        items: items.map((i) => ({ productId: i.productId, size: i.size, color: i.color, quantity: i.quantity })),
      });
      if (res.ok) {
        clear();
        router.push(`/order/${res.orderNumber}?new=1${res.emailSent ? "&mail=1" : ""}`);
      } else {
        setError(res.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center card">
        <div className="text-5xl">🛍️</div>
        <p className="mt-4 font-semibold">Your bag is empty</p>
        <Link href="/shop" className="btn-primary mt-6">Shop now</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-5 gap-6 lg:gap-10">
      <div className="lg:col-span-3 space-y-6">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="card p-5 sm:p-7">
          <h2 className="font-semibold text-lg flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white text-xs">1</span> Contact Information</h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Full Name *</label>
              <input required className="input" value={form.name} onChange={set("name")} placeholder="Ali Khan" />
            </div>
            <div>
              <label className="label">Email (Gmail) *</label>
              <input required type="email" className="input" value={form.email} onChange={set("email")} placeholder="you@gmail.com" />
              <p className="mt-1 text-[11px] text-black/45">Order confirmation & invoice will be sent here.</p>
            </div>
            <div>
              <label className="label">Phone / WhatsApp *</label>
              <input required type="tel" className="input" value={form.phone} onChange={set("phone")} placeholder="03001234567" />
            </div>
          </div>
        </section>

        <section className="card p-5 sm:p-7">
          <h2 className="font-semibold text-lg flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white text-xs">2</span> Delivery Address</h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Complete Address *</label>
              <textarea required className="input min-h-[80px]" value={form.address} onChange={set("address")} placeholder="House #, Street, Area / Block" />
            </div>
            <div>
              <label className="label">City *</label>
              <input required className="input" value={form.city} onChange={set("city")} placeholder="Lahore" />
            </div>
            <div>
              <label className="label">Province *</label>
              <select className="input" value={form.province} onChange={set("province")}>
                {PROVINCES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Postal Code</label>
              <input className="input" value={form.postalCode} onChange={set("postalCode")} placeholder="54000" />
            </div>
            <div>
              <label className="label">Order Notes</label>
              <input className="input" value={form.notes} onChange={set("notes")} placeholder="Landmark, delivery time…" />
            </div>
          </div>
        </section>

        <section className="card p-5 sm:p-7">
          <h2 className="font-semibold text-lg flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white text-xs">3</span> Payment Method</h2>
          <label className="mt-5 flex items-center gap-4 rounded-2xl border-2 border-gold bg-gold/5 p-4 cursor-pointer">
            <input type="radio" checked readOnly className="accent-gold h-5 w-5" />
            <div className="flex-1">
              <p className="font-bold">Cash on Delivery (COD)</p>
              <p className="text-xs text-black/55">Pay {formatPrice(total)} in cash when your parcel arrives.</p>
            </div>
            <span className="text-2xl">💵</span>
          </label>
          <p className="mt-3 text-[11px] text-black/45">By placing this order you agree to our 7-day return policy (exchange / store credit only, no cash refunds).</p>
        </section>
      </div>

      <aside className="lg:col-span-2">
        <div className="card p-5 sm:p-6 lg:sticky lg:top-28">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <ul className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}`} className="flex gap-3 text-sm">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image} alt="" className="h-16 w-14 rounded-lg object-cover bg-sand" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-white">{i.quantity}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold leading-tight line-clamp-2">{i.name}</p>
                  <p className="text-xs text-black/50">Size {i.size}</p>
                </div>
                <span className="font-semibold">{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 text-sm border-t border-black/10 pt-4">
            <div className="flex justify-between"><dt className="text-black/60">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-black/60">Shipping</dt><dd>{shipping === 0 ? <span className="text-green-700 font-semibold">FREE</span> : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between text-lg border-t border-black/10 pt-3"><dt className="font-bold">Total (COD)</dt><dd className="font-bold">{formatPrice(total)}</dd></div>
          </dl>
          <button type="submit" disabled={pending} className="btn-gold w-full mt-5 !py-4">
            {pending ? "Placing order…" : "Place Order • COD"}
          </button>
          <p className="mt-3 text-center text-[11px] text-black/45">🔒 Your information is stored securely.</p>
        </div>
      </aside>
    </form>
  );
}
