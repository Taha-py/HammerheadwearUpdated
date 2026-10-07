"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice, SHIPPING_FEE, FREE_SHIPPING_OVER } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQty, remove, subtotal } = useCart();
  const shipping = subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : SHIPPING_FEE;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-14">
      <h1 className="font-display text-3xl sm:text-4xl font-bold">Your Bag</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-6xl">🛍️</div>
          <p className="mt-4 font-semibold">Your bag is empty</p>
          <Link href="/shop" className="btn-primary mt-6">Continue Shopping</Link>
        </div>
      ) : (
        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((i) => (
              <div key={`${i.productId}-${i.size}`} className="card p-3 sm:p-4 flex gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt={i.name} className="h-28 w-24 rounded-xl object-cover bg-sand" />
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between gap-2">
                    <Link href={`/product/${i.slug}`} className="font-semibold leading-tight">{i.name}</Link>
                    <button onClick={() => remove(i.productId, i.size)} className="text-black/40 hover:text-red-500">✕</button>
                  </div>
                  <p className="text-xs text-black/50 mt-1">Size {i.size}{i.color ? ` • ${i.color}` : ""}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-black/10">
                      <button onClick={() => updateQty(i.productId, i.size, i.quantity - 1)} className="h-9 w-9 text-lg">−</button>
                      <span className="w-6 text-center text-sm font-semibold">{i.quantity}</span>
                      <button onClick={() => updateQty(i.productId, i.size, i.quantity + 1)} className="h-9 w-9 text-lg">+</button>
                    </div>
                    <span className="font-bold">{formatPrice(i.price * i.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="card p-5 h-fit lg:sticky lg:top-28">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-black/60">Subtotal</dt><dd className="font-semibold">{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-black/60">Shipping</dt><dd className="font-semibold">{shipping === 0 ? <span className="text-green-700">FREE</span> : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between border-t border-black/10 pt-3 text-base"><dt className="font-bold">Total</dt><dd className="font-bold">{formatPrice(subtotal + shipping)}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-black/50">Payment: Cash on Delivery</p>
            <Link href="/checkout" className="btn-gold w-full mt-5">Proceed to Checkout</Link>
            <Link href="/shop" className="block text-center text-xs font-semibold underline mt-3">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
