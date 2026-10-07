"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { finalPrice, formatPrice, stockLabel, DEFAULT_SIZE_CHARTS } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { useRouter } from "next/navigation";

export default function ProductDetail({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>(product.colors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [chartOpen, setChartOpen] = useState(false);
  const [tab, setTab] = useState<"desc" | "size" | "ship">("desc");
  const { add, showToast, setDrawerOpen } = useCart();
  const router = useRouter();
  const touchStart = useRef<number | null>(null);

  const price = finalPrice(product);
  const stock = stockLabel(product.stock);
  const media: { type: "img" | "video"; src: string }[] = [
    ...product.images.map((src) => ({ type: "img" as const, src })),
    ...(product.videoUrl ? [{ type: "video" as const, src: product.videoUrl }] : []),
  ];
  const chart = product.sizeChart ?? DEFAULT_SIZE_CHARTS[product.category];

  function addToBag(goCheckout = false) {
    if (!size) {
      showToast("Please select a size");
      setTab("size");
      return;
    }
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] || "/logo.png",
      price,
      size,
      color,
      quantity: qty,
      maxStock: product.stock,
    });
    if (goCheckout) router.push("/checkout");
    else {
      showToast("Added to bag ✓");
      setTimeout(() => setDrawerOpen(true), 300);
    }
  }

  const isYouTube = (u: string) => /youtube\.com|youtu\.be/.test(u);
  const ytEmbed = (u: string) => {
    const m = u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : u;
  };

  return (
    <div className="mx-auto max-w-7xl px-0 sm:px-6 py-0 sm:py-10">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-14">
        {/* Gallery */}
        <div>
          <div
            className="relative aspect-[3/4] sm:rounded-3xl overflow-hidden bg-sand perspective select-none"
            onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart.current == null || media.length < 2) return;
              const dx = e.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(dx) > 35) setActive((a) => (a + (dx < 0 ? 1 : media.length - 1)) % media.length);
              touchStart.current = null;
            }}
          >
            {media[active]?.type === "video" ? (
              isYouTube(media[active].src) ? (
                <iframe src={ytEmbed(media[active].src)} className="h-full w-full" allow="autoplay; encrypted-media" allowFullScreen title="Product video" />
              ) : (
                <video src={media[active].src} controls autoPlay muted loop playsInline className="h-full w-full object-cover" />
              )
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={active} src={media[active]?.src || "/logo.png"} alt={product.name} className="h-full w-full object-cover animate-fade-up" />
            )}
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.onSale && product.discountPct > 0 && <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">-{product.discountPct}% OFF</span>}
              {product.isNew && <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink shadow">NEW</span>}
            </div>
            {media.length > 1 && (
              <>
                <button onClick={() => setActive((a) => (a - 1 + media.length) % media.length)} className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass shadow flex items-center justify-center">‹</button>
                <button onClick={() => setActive((a) => (a + 1) % media.length)} className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass shadow flex items-center justify-center">›</button>
              </>
            )}
          </div>
          {media.length > 1 && (
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-3 sm:px-0">
              {media.map((m, i) => (
                <button key={i} onClick={() => setActive(i)} className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${i === active ? "border-gold" : "border-transparent"}`}>
                  {m.type === "video" ? (
                    <div className="flex h-full w-full items-center justify-center bg-ink text-white text-xl">▶</div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.src} alt="" className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-4 sm:px-0 pb-28 lg:pb-0">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-dark font-bold">
            <Link href={`/shop?category=${product.category}`}>{product.category}</Link> / <Link href={`/shop?style=${product.style}`}>{product.style}</Link> / {product.type}
          </p>
          <h1 className="font-display text-2xl sm:text-4xl font-bold mt-2 leading-tight">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold">{formatPrice(price)}</span>
            {price !== product.price && (
              <>
                <span className="text-black/40 line-through">{formatPrice(product.price)}</span>
                <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">Save {formatPrice(product.price - price)}</span>
              </>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className={`inline-flex items-center gap-1.5 font-semibold ${stock.tone === "out" ? "text-red-600" : stock.tone === "low" ? "text-orange-600" : "text-green-700"}`}>
              <span className={`h-2 w-2 rounded-full ${stock.tone === "out" ? "bg-red-600" : stock.tone === "low" ? "bg-orange-500" : "bg-green-600"} ${stock.tone !== "out" ? "animate-pulse" : ""}`} />
              {stock.text}
            </span>
            {product.stock > 0 && <span className="text-black/40">• {product.stock} pcs available</span>}
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="label">Color: <span className="text-ink normal-case">{color}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${color === c ? "border-ink bg-ink text-white" : "border-black/15"}`}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="label !mb-0">Size {size && <span className="text-ink">: {size}</span>}</p>
              <button onClick={() => setChartOpen(true)} className="text-xs font-bold underline underline-offset-4 flex items-center gap-1">📏 Size Chart</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  disabled={product.stock <= 0}
                  className={`min-w-12 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${size === s ? "border-gold bg-gold text-ink shadow-[0_6px_20px_-8px_rgba(201,162,74,0.9)]" : "border-black/15 hover:border-ink"} disabled:opacity-40`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + CTA (desktop) */}
          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-black/15">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-11 w-11 text-xl">−</button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))} className="h-11 w-11 text-xl">+</button>
            </div>
            <div className="hidden lg:flex flex-1 gap-2">
              <button onClick={() => addToBag(false)} disabled={product.stock <= 0} className="btn-primary flex-1">Add to Bag</button>
              <button onClick={() => addToBag(true)} disabled={product.stock <= 0} className="btn-gold flex-1">Buy Now • COD</button>
            </div>
          </div>

          {/* Trust */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs">
            {[["💵", "Cash on Delivery"], ["🔁", "7-Day Return"], ["🚚", "Free ship 5000+"]].map(([i, t]) => (
              <div key={t} className="rounded-xl bg-sand px-2 py-3">
                <div className="text-lg">{i}</div>
                <div className="font-semibold mt-1">{t}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-black/10 flex gap-6 text-sm font-semibold">
            {[["desc", "Details"], ["size", "Size Chart"], ["ship", "Shipping & Returns"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k as typeof tab)} className={`pb-3 -mb-px border-b-2 ${tab === k ? "border-gold text-ink" : "border-transparent text-black/50"}`}>{l}</button>
            ))}
          </div>
          <div className="pt-5 text-sm leading-relaxed text-black/75">
            {tab === "desc" && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <ul className="grid grid-cols-2 gap-2 text-xs">
                  {product.fabric && <li className="rounded-lg bg-sand p-2.5"><span className="block text-black/45 uppercase tracking-wider text-[10px]">Fabric</span>{product.fabric}</li>}
                  <li className="rounded-lg bg-sand p-2.5"><span className="block text-black/45 uppercase tracking-wider text-[10px]">Type</span>{product.type}</li>
                  <li className="rounded-lg bg-sand p-2.5"><span className="block text-black/45 uppercase tracking-wider text-[10px]">Style</span>{product.style}</li>
                  <li className="rounded-lg bg-sand p-2.5"><span className="block text-black/45 uppercase tracking-wider text-[10px]">SKU</span>HH-{String(product.id).padStart(4, "0")}</li>
                </ul>
              </div>
            )}
            {tab === "size" && <SizeChartTable chart={chart} />}
            {tab === "ship" && (
              <ul className="space-y-2 list-disc pl-4">
                <li>Payment: <strong>Cash on Delivery</strong> only.</li>
                <li>Delivery in 2–5 working days across Pakistan. Rs. 250 shipping; FREE above Rs. 5,000.</li>
                <li><strong>7-day return / exchange</strong> policy from delivery date. Items must be unworn with tags.</li>
                <li><strong>No cash refunds</strong> — exchange or store credit only.</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-[64px] inset-x-0 z-30 glass border-t border-black/5 p-3 flex gap-2">
        <button onClick={() => addToBag(false)} disabled={product.stock <= 0} className="btn-primary flex-1 !py-3 !text-xs">Add to Bag</button>
        <button onClick={() => addToBag(true)} disabled={product.stock <= 0} className="btn-gold flex-1 !py-3 !text-xs">Buy Now</button>
      </div>

      {/* Size chart modal */}
      {chartOpen && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center" onClick={() => setChartOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div onClick={(e) => e.stopPropagation()} className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-7 animate-fade-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold">Size Chart — {product.name}</h3>
              <button onClick={() => setChartOpen(false)} className="h-9 w-9 rounded-full hover:bg-black/5">✕</button>
            </div>
            <SizeChartTable chart={chart} />
            <p className="mt-4 text-xs text-black/50">Measurements are body measurements in {chart.unit}. If between sizes, we recommend sizing up.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function SizeChartTable({ chart }: { chart: { unit: string; rows: { size: string; chest: string; waist: string; length: string }[] } }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/10">
      <table className="w-full text-sm">
        <thead className="bg-ink text-white text-xs uppercase tracking-wider">
          <tr>
            <th className="px-3 py-2.5 text-left">Size</th>
            <th className="px-3 py-2.5 text-left">Chest ({chart.unit})</th>
            <th className="px-3 py-2.5 text-left">Waist ({chart.unit})</th>
            <th className="px-3 py-2.5 text-left">Length ({chart.unit})</th>
          </tr>
        </thead>
        <tbody>
          {chart.rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-sand" : "bg-white"}>
              <td className="px-3 py-2.5 font-bold">{r.size}</td>
              <td className="px-3 py-2.5">{r.chest}</td>
              <td className="px-3 py-2.5">{r.waist}</td>
              <td className="px-3 py-2.5">{r.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
