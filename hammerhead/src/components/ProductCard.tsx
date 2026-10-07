"use client";

import Link from "next/link";
import type { Product } from "@/db/schema";
import { finalPrice, formatPrice, stockLabel } from "@/lib/utils";
import TiltCard from "./TiltCard";
import { useCart } from "./CartProvider";
import { useRef, useState } from "react";

export default function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const price = finalPrice(product);
  const stock = stockLabel(product.stock);
  const { add, showToast, setDrawerOpen } = useCart();
  const [picking, setPicking] = useState(false);
  const [touchIdx, setTouchIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const startX = useRef<number | null>(null);

  const images = (product.images.length ? product.images : ["/logo.png"]).slice(0, 2);
  const active = hovered && images.length > 1 ? 1 : touchIdx % images.length;

  function quickAdd(size: string) {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: images[0],
      price,
      size,
      color: product.colors[0],
      quantity: 1,
      maxStock: product.stock,
    });
    setPicking(false);
    showToast("Added to bag ✓");
    setTimeout(() => setDrawerOpen(true), 350);
  }

  return (
    <TiltCard max={6} className={`group card overflow-hidden ${compact ? "" : ""}`}>
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-[3/4] overflow-hidden bg-sand"
        onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (startX.current == null) return;
          const dx = e.changedTouches[0].clientX - startX.current;
          if (Math.abs(dx) > 35 && images.length > 1) setTouchIdx((i) => (i + 1) % images.length);
          startX.current = null;
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={i === 0 ? product.name : ""}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${active === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? "w-4 bg-white" : "w-1.5 bg-white/60"}`} />
            ))}
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.onSale && product.discountPct > 0 && (
            <span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
              -{product.discountPct}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink shadow">New</span>
          )}
        </div>
        <span
          className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow ${
            stock.tone === "out" ? "bg-ink text-white" : stock.tone === "low" ? "bg-orange-500 text-white" : "bg-white/90 text-green-700"
          }`}
        >
          {stock.text}
        </span>
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
            <span className="rotate-[-8deg] rounded border-2 border-ink px-4 py-1.5 font-display text-xl font-bold uppercase tracking-widest">Sold Out</span>
          </div>
        )}
      </Link>

      <div className="p-3 sm:p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-black/45 font-semibold">
          {product.category} • {product.style}
        </p>
        <Link href={`/product/${product.slug}`} className="mt-1 block text-sm sm:text-[15px] font-semibold leading-snug line-clamp-2 min-h-[2.5em]">
          {product.name}
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold">{formatPrice(price)}</span>
          {price !== product.price && <span className="text-xs text-black/40 line-through">{formatPrice(product.price)}</span>}
        </div>

        {product.stock > 0 && (
          <div className="mt-3">
            {!picking ? (
              <button onClick={() => setPicking(true)} className="w-full rounded-full border border-ink py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition hover:bg-ink hover:text-white">
                + Quick Add
              </button>
            ) : (
              <div className="animate-fade-up">
                <p className="mb-1.5 text-[10px] uppercase tracking-wider text-black/50 font-semibold">Select size</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => quickAdd(s)} className="min-w-9 rounded-md border border-black/15 px-2 py-1 text-xs font-semibold hover:border-gold hover:bg-gold/10">
                      {s}
                    </button>
                  ))}
                  <button onClick={() => setPicking(false)} className="px-2 text-xs text-black/40">✕</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </TiltCard>
  );
}
