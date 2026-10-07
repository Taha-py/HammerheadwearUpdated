"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatPrice, FREE_SHIPPING_OVER } from "@/lib/utils";

export default function CartDrawer() {
  const { items, drawerOpen, setDrawerOpen, updateQty, remove, subtotal, count } = useCart();
  const remaining = FREE_SHIPPING_OVER - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_OVER) * 100);

  return (
    <div className={`fixed inset-0 z-50 ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        onClick={() => setDrawerOpen(false)}
        className={`absolute inset-0 bg-black/50 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
          <h2 className="font-display text-xl font-semibold">
            Your Bag <span className="text-sm text-black/50 font-body">({count})</span>
          </h2>
          <button onClick={() => setDrawerOpen(false)} className="h-9 w-9 rounded-full hover:bg-black/5" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="text-xs font-medium">
            {remaining > 0 ? (
              <>
                Add <span className="text-gold-dark font-bold">{formatPrice(remaining)}</span> more for FREE delivery
              </>
            ) : (
              <span className="text-green-700 font-bold">🎉 You unlocked FREE delivery!</span>
            )}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold-light transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center py-16">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="font-semibold">Your bag is empty</p>
              <p className="text-sm text-black/50 mt-1">Discover pieces made for you.</p>
              <Link href="/shop" onClick={() => setDrawerOpen(false)} className="btn-primary mt-6">
                Start Shopping
              </Link>
            </div>
          )}
          {items.map((i) => (
            <div key={`${i.productId}-${i.size}`} className="flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.image} alt={i.name} className="h-24 w-20 rounded-xl object-cover bg-sand" />
              <div className="flex flex-1 flex-col">
                <Link href={`/product/${i.slug}`} onClick={() => setDrawerOpen(false)} className="text-sm font-semibold leading-tight line-clamp-2">
                  {i.name}
                </Link>
                <p className="text-xs text-black/50 mt-0.5">
                  Size: {i.size}
                  {i.color ? ` • ${i.color}` : ""}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-black/10">
                    <button onClick={() => updateQty(i.productId, i.size, i.quantity - 1)} className="h-8 w-8 text-lg leading-none">
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{i.quantity}</span>
                    <button onClick={() => updateQty(i.productId, i.size, i.quantity + 1)} className="h-8 w-8 text-lg leading-none">
                      +
                    </button>
                  </div>
                  <span className="text-sm font-bold">{formatPrice(i.price * i.quantity)}</span>
                </div>
              </div>
              <button onClick={() => remove(i.productId, i.size)} className="self-start text-black/40 hover:text-red-500" aria-label="Remove">
                ✕
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-black/5 p-5 safe-bottom">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-black/60">Subtotal</span>
              <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
            </div>
            <Link href="/checkout" onClick={() => setDrawerOpen(false)} className="btn-gold w-full">
              Checkout • Cash on Delivery
            </Link>
            <Link href="/cart" onClick={() => setDrawerOpen(false)} className="mt-2 block text-center text-xs font-semibold uppercase tracking-wider underline">
              View full bag
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
