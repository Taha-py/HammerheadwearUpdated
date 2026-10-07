"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Product, SizeChart } from "@/db/schema";
import { CATEGORIES, DEFAULT_SIZE_CHARTS, PRODUCT_TYPES, STYLES, formatPrice } from "@/lib/utils";
import { saveProduct, type ProductInput } from "../actions";

const SIZE_PRESETS: Record<string, string[]> = {
  men: ["S", "M", "L", "XL", "XXL"],
  women: ["XS", "S", "M", "L", "XL"],
  kids: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"],
  jeans: ["28", "30", "32", "34", "36", "38"],
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [f, setF] = useState<ProductInput>({
    id: product?.id,
    name: product?.name ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "men",
    style: product?.style ?? "casual",
    type: product?.type ?? "shirt",
    price: product?.price ?? 0,
    onSale: product?.onSale ?? false,
    discountPct: product?.discountPct ?? 0,
    stock: product?.stock ?? 10,
    images: product?.images ?? [],
    videoUrl: product?.videoUrl ?? "",
    sizes: product?.sizes ?? SIZE_PRESETS.men,
    sizeChart: product?.sizeChart ?? DEFAULT_SIZE_CHARTS.men,
    featured: product?.featured ?? false,
    isNew: product?.isNew ?? true,
    colors: product?.colors ?? [],
    fabric: product?.fabric ?? "",
  });
  const [imgUrl, setImgUrl] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const up = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) => setF((s) => ({ ...s, [k]: v }));

  async function upload(files: FileList | null, kind: "image" | "video") {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        if (kind === "image") setF((s) => ({ ...s, images: [...s.images, data.url] }));
        else setF((s) => ({ ...s, videoUrl: data.url }));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await saveProduct(f);
      if (res.ok) router.push("/admin/products");
      else {
        setError(res.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  const salePrice = f.onSale && f.discountPct > 0 ? Math.round(f.price * (1 - f.discountPct / 100)) : f.price;
  const chart = f.sizeChart;
  const setRow = (i: number, k: keyof SizeChart["rows"][number], v: string) => {
    const rows = chart.rows.map((r, idx) => (idx === i ? { ...r, [k]: v } : r));
    up("sizeChart", { ...chart, rows });
  };

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="card p-5">
          <h2 className="font-semibold mb-4">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Product Name *</label>
              <input className="input" value={f.name} onChange={(e) => up("name", e.target.value)} placeholder="Indigo Slim-Fit Jeans" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea className="input min-h-[110px]" value={f.description} onChange={(e) => up("description", e.target.value)} placeholder="Fabric, fit, details…" />
            </div>
            <div>
              <label className="label">Category *</label>
              <select
                className="input"
                value={f.category}
                onChange={(e) => {
                  const c = e.target.value;
                  setF((s) => ({ ...s, category: c, sizes: SIZE_PRESETS[c] ?? s.sizes, sizeChart: product?.sizeChart && product.category === c ? product.sizeChart : DEFAULT_SIZE_CHARTS[c] }));
                }}
              >
                {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Style *</label>
              <select className="input" value={f.style} onChange={(e) => up("style", e.target.value)}>
                {STYLES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Type *</label>
              <select className="input capitalize" value={f.type} onChange={(e) => up("type", e.target.value)}>
                {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Fabric</label>
              <input className="input" value={f.fabric} onChange={(e) => up("fabric", e.target.value)} placeholder="100% Cotton" />
            </div>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold mb-4">Media — Pictures & Video</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {f.images.map((src, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-sand group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                {i === 0 && <span className="absolute left-1 top-1 rounded bg-gold px-1.5 py-0.5 text-[9px] font-bold">MAIN</span>}
                <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 bg-gradient-to-t from-black/70">
                  <button type="button" onClick={() => i > 0 && up("images", [...f.images.slice(0, i - 1), f.images[i], f.images[i - 1], ...f.images.slice(i + 1)])} className="text-white text-xs px-1">◀</button>
                  <button type="button" onClick={() => up("images", f.images.filter((_, idx) => idx !== i))} className="text-white text-xs bg-red-600 rounded px-1.5">✕</button>
                </div>
              </div>
            ))}
            <label className="aspect-[3/4] rounded-xl border-2 border-dashed border-black/15 flex flex-col items-center justify-center text-xs text-black/50 cursor-pointer hover:border-gold hover:bg-gold/5">
              <span className="text-2xl">{uploading ? "⏳" : "＋"}</span>
              <span>{uploading ? "Uploading…" : "Upload"}</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files, "image")} />
            </label>
          </div>
          <div className="mt-3 flex gap-2">
            <input className="input" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="…or paste image URL" />
            <button type="button" onClick={() => { if (imgUrl.trim()) { up("images", [...f.images, imgUrl.trim()]); setImgUrl(""); } }} className="btn-outline !py-2 !px-4 shrink-0">Add</button>
          </div>
          <div className="mt-5">
            <label className="label">Product Video (optional)</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input className="input" value={f.videoUrl} onChange={(e) => up("videoUrl", e.target.value)} placeholder="YouTube link or uploaded video URL" />
              <label className="btn-outline !py-2.5 !px-4 shrink-0 cursor-pointer">
                Upload MP4
                <input type="file" accept="video/*" className="hidden" onChange={(e) => upload(e.target.files, "video")} />
              </label>
            </div>
            {f.videoUrl && <p className="mt-1 text-xs text-green-700">✓ Video attached</p>}
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Size Chart (editable per product)</h2>
            <div className="flex items-center gap-2 text-xs">
              <span>Unit</span>
              <select className="input !py-1 !px-2 w-24" value={chart.unit} onChange={(e) => up("sizeChart", { ...chart, unit: e.target.value })}>
                <option value="inches">inches</option>
                <option value="cm">cm</option>
              </select>
              <button type="button" onClick={() => up("sizeChart", DEFAULT_SIZE_CHARTS[f.category])} className="underline">Reset</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-[10px] uppercase tracking-wider text-black/50"><th className="text-left py-1">Size</th><th className="text-left py-1">Chest</th><th className="text-left py-1">Waist</th><th className="text-left py-1">Length</th><th /></tr></thead>
              <tbody>
                {chart.rows.map((r, i) => (
                  <tr key={i}>
                    <td className="pr-1 py-1"><input className="input !py-1.5 !px-2 w-20" value={r.size} onChange={(e) => setRow(i, "size", e.target.value)} /></td>
                    <td className="pr-1 py-1"><input className="input !py-1.5 !px-2 w-24" value={r.chest} onChange={(e) => setRow(i, "chest", e.target.value)} /></td>
                    <td className="pr-1 py-1"><input className="input !py-1.5 !px-2 w-24" value={r.waist} onChange={(e) => setRow(i, "waist", e.target.value)} /></td>
                    <td className="pr-1 py-1"><input className="input !py-1.5 !px-2 w-24" value={r.length} onChange={(e) => setRow(i, "length", e.target.value)} /></td>
                    <td><button type="button" onClick={() => up("sizeChart", { ...chart, rows: chart.rows.filter((_, idx) => idx !== i) })} className="text-red-500 px-2">✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => up("sizeChart", { ...chart, rows: [...chart.rows, { size: "", chest: "", waist: "", length: "" }] })} className="mt-2 text-xs font-bold underline">+ Add row</button>
        </section>
      </div>

      <div className="space-y-5">
        <section className="card p-5">
          <h2 className="font-semibold mb-4">Pricing & Sale</h2>
          <label className="label">Price (PKR) *</label>
          <input type="number" min={0} className="input" value={f.price || ""} onChange={(e) => up("price", Number(e.target.value))} />
          <label className="mt-4 flex items-center justify-between rounded-xl border border-black/10 p-3 cursor-pointer">
            <span className="text-sm font-semibold">On Sale</span>
            <input type="checkbox" checked={f.onSale} onChange={(e) => up("onSale", e.target.checked)} className="h-5 w-5 accent-gold" />
          </label>
          {f.onSale && (
            <div className="mt-3">
              <label className="label">Discount %</label>
              <input type="number" min={0} max={90} className="input" value={f.discountPct} onChange={(e) => up("discountPct", Number(e.target.value))} />
            </div>
          )}
          <div className="mt-4 rounded-xl bg-sand p-3 text-sm">
            <p className="text-black/50 text-xs">Customer pays</p>
            <p className="font-bold text-lg">{formatPrice(salePrice)} {salePrice !== f.price && <span className="text-xs text-black/40 line-through font-normal">{formatPrice(f.price)}</span>}</p>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold mb-4">Inventory</h2>
          <label className="label">Quantity in stock *</label>
          <input type="number" min={0} className="input" value={f.stock} onChange={(e) => up("stock", Number(e.target.value))} />
          <p className={`mt-2 text-xs font-bold ${f.stock <= 0 ? "text-red-600" : f.stock <= 5 ? "text-orange-600" : "text-green-700"}`}>
            {f.stock <= 0 ? "Will display as OUT OF STOCK" : f.stock <= 5 ? `Will display "Only ${f.stock} left"` : "Will display as IN STOCK"}
          </p>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold mb-3">Sizes *</h2>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {f.sizes.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-ink text-white px-3 py-1 text-xs font-semibold">
                {s}<button type="button" onClick={() => up("sizes", f.sizes.filter((x) => x !== s))}>✕</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input !py-2" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} placeholder="e.g. 32" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (sizeInput.trim()) { up("sizes", [...f.sizes, sizeInput.trim()]); setSizeInput(""); } } }} />
            <button type="button" onClick={() => { if (sizeInput.trim()) { up("sizes", [...f.sizes, sizeInput.trim()]); setSizeInput(""); } }} className="btn-outline !py-2 !px-3">Add</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
            {Object.entries(SIZE_PRESETS).map(([k, v]) => (
              <button key={k} type="button" onClick={() => up("sizes", v)} className="rounded-full border border-black/10 px-2 py-0.5 capitalize hover:border-ink">{k} preset</button>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold mb-3">Colors</h2>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {f.colors.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-sand px-3 py-1 text-xs font-semibold">
                {s}<button type="button" onClick={() => up("colors", f.colors.filter((x) => x !== s))}>✕</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input !py-2" value={colorInput} onChange={(e) => setColorInput(e.target.value)} placeholder="e.g. Black" />
            <button type="button" onClick={() => { if (colorInput.trim()) { up("colors", [...f.colors, colorInput.trim()]); setColorInput(""); } }} className="btn-outline !py-2 !px-3">Add</button>
          </div>
        </section>

        <section className="card p-5 space-y-2">
          <h2 className="font-semibold mb-1">Visibility</h2>
          <label className="flex items-center justify-between text-sm"><span>Featured on homepage</span><input type="checkbox" checked={f.featured} onChange={(e) => up("featured", e.target.checked)} className="h-5 w-5 accent-gold" /></label>
          <label className="flex items-center justify-between text-sm"><span>Mark as New Arrival</span><input type="checkbox" checked={f.isNew} onChange={(e) => up("isNew", e.target.checked)} className="h-5 w-5 accent-gold" /></label>
        </section>

        <div className="sticky bottom-20 lg:bottom-4 flex gap-2">
          <button type="submit" disabled={pending || uploading} className="btn-gold flex-1 !py-4">{pending ? "Saving…" : product ? "Save Changes" : "Create Product"}</button>
          <button type="button" onClick={() => router.push("/admin/products")} className="btn-outline bg-white">Cancel</button>
        </div>
      </div>
    </form>
  );
}
