import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";
import { finalPrice, formatPrice, stockLabel } from "@/lib/utils";
import { deleteProduct, quickUpdateStock } from "../actions";
import { ensureSeeded } from "@/lib/seed";

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await ensureSeeded();
  const { q } = await searchParams;
  let rows = await db.select().from(products).orderBy(desc(products.id));
  if (q) rows = rows.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Products</h1>
          <p className="text-sm text-black/55">{rows.length} products • edit, add or delete</p>
        </div>
        <div className="flex gap-2">
          <form className="flex gap-2">
            <input name="q" defaultValue={q} placeholder="Search…" className="input !py-2 w-40 sm:w-56" />
          </form>
          <Link href="/admin/products/new" className="btn-gold !py-2.5 shrink-0">+ Add</Link>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden md:grid grid-cols-[64px_1fr_120px_130px_120px_140px] gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-black/50 border-b border-black/5">
          <span>Image</span><span>Product</span><span>Price</span><span>Stock</span><span>Status</span><span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-black/5">
          {rows.map((p) => {
            const st = stockLabel(p.stock);
            return (
              <div key={p.id} className="grid grid-cols-[64px_1fr] md:grid-cols-[64px_1fr_120px_130px_120px_140px] gap-3 px-4 py-3 items-center text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0] || "/logo.png"} alt="" className="h-16 w-14 rounded-lg object-cover bg-sand" />
                <div className="min-w-0">
                  <Link href={`/admin/products/${p.id}`} className="font-semibold line-clamp-1 hover:underline">{p.name}</Link>
                  <p className="text-xs text-black/50 capitalize">{p.category} • {p.style} • {p.type}</p>
                  <div className="md:hidden mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold">{formatPrice(finalPrice(p))}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.tone === "out" ? "bg-red-100 text-red-700" : st.tone === "low" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>{st.text}</span>
                    {p.onSale && <span className="rounded-full bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold">-{p.discountPct}%</span>}
                  </div>
                  <div className="md:hidden mt-2 flex gap-2">
                    <Link href={`/admin/products/${p.id}`} className="rounded-full border border-ink px-3 py-1 text-xs font-bold">Edit</Link>
                    <form action={deleteProduct}><input type="hidden" name="id" value={p.id} /><button className="rounded-full border border-red-300 text-red-600 px-3 py-1 text-xs font-bold">Delete</button></form>
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="font-bold">{formatPrice(finalPrice(p))}</p>
                  {p.onSale && <p className="text-xs text-black/40 line-through">{formatPrice(p.price)}</p>}
                </div>
                <div className="hidden md:block">
                  <form action={quickUpdateStock} className="flex items-center gap-1">
                    <input type="hidden" name="id" value={p.id} />
                    <input name="stock" type="number" min={0} defaultValue={p.stock} className="input !py-1.5 !px-2 w-16 text-center" />
                    <button className="rounded-lg bg-ink text-white px-2 py-1.5 text-xs" title="Update stock">✓</button>
                  </form>
                  <p className={`mt-1 text-[10px] font-bold ${st.tone === "out" ? "text-red-600" : st.tone === "low" ? "text-orange-600" : "text-green-700"}`}>{st.text}</p>
                </div>
                <div className="hidden md:flex flex-wrap gap-1">
                  {p.onSale && <span className="rounded-full bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold">SALE -{p.discountPct}%</span>}
                  {p.featured && <span className="rounded-full bg-gold/20 text-gold-dark px-2 py-0.5 text-[10px] font-bold">FEATURED</span>}
                  {p.isNew && <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-bold">NEW</span>}
                  {p.videoUrl && <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold">▶ VIDEO</span>}
                </div>
                <div className="hidden md:flex justify-end gap-2">
                  <Link href={`/product/${p.slug}`} target="_blank" className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-bold hover:border-ink">View</Link>
                  <Link href={`/admin/products/${p.id}`} className="rounded-full bg-ink text-white px-3 py-1.5 text-xs font-bold">Edit</Link>
                  <form action={deleteProduct}><input type="hidden" name="id" value={p.id} /><button className="rounded-full border border-red-300 text-red-600 px-3 py-1.5 text-xs font-bold hover:bg-red-50">Delete</button></form>
                </div>
              </div>
            );
          })}
          {rows.length === 0 && <p className="p-10 text-center text-sm text-black/50">No products found.</p>}
        </div>
      </div>
    </div>
  );
}
