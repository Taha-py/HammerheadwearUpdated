import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { CATEGORIES, PRODUCT_TYPES, STYLES } from "@/lib/utils";
import type { Metadata } from "next";

type SP = { [k: string]: string | string[] | undefined };

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const cat = typeof sp.category === "string" ? sp.category : undefined;
  const style = typeof sp.style === "string" ? sp.style : undefined;
  const title = cat ? `${cat[0].toUpperCase()}${cat.slice(1)} Collection` : style ? `${style[0].toUpperCase()}${style.slice(1)} Wear` : sp.sale ? "Sale" : "Shop All";
  return { title };
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const s = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const filters = {
    category: s("category"),
    style: s("style"),
    type: s("type"),
    q: s("q"),
    sale: s("sale") === "1",
    sort: (s("sort") as "newest" | "price-asc" | "price-desc" | undefined) ?? "newest",
  };
  const items = await getProducts(filters);

  const build = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { ...filters, sale: filters.sale ? "1" : undefined, ...patch } as Record<string, string | boolean | undefined>;
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== "newest") p.set(k, String(v));
    });
    const qs = p.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  };

  const heading = filters.q
    ? `Results for “${filters.q}”`
    : filters.sale
      ? "Sale"
      : filters.category
        ? `${filters.category[0].toUpperCase()}${filters.category.slice(1)}`
        : filters.style
          ? `${filters.style[0].toUpperCase()}${filters.style.slice(1)} Wear`
          : "All Products";

  return (
    <div>
      {/* Banner */}
      <div className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-14">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold font-bold">
            <Link href="/">Home</Link> / Shop
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold mt-2">{heading}</h1>
          <p className="text-white/60 text-sm mt-2">{items.length} products</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Filter chips */}
        <div className="space-y-2.5">
          <Row label="Category">
            <Chip href={build({ category: undefined })} active={!filters.category}>All</Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c.key} href={build({ category: c.key })} active={filters.category === c.key}>{c.label}</Chip>
            ))}
          </Row>
          <Row label="Style">
            <Chip href={build({ style: undefined })} active={!filters.style}>All</Chip>
            {STYLES.map((c) => (
              <Chip key={c.key} href={build({ style: c.key })} active={filters.style === c.key}>{c.label}</Chip>
            ))}
            <Chip href={build({ sale: filters.sale ? undefined : "1" })} active={filters.sale} tone="red">On Sale</Chip>
          </Row>
          <Row label="Type">
            <Chip href={build({ type: undefined })} active={!filters.type}>All</Chip>
            {PRODUCT_TYPES.map((t) => (
              <Chip key={t} href={build({ type: t })} active={filters.type === t}>{t}</Chip>
            ))}
          </Row>
          <Row label="Sort">
            {[
              ["newest", "Newest"],
              ["price-asc", "Price: Low → High"],
              ["price-desc", "Price: High → Low"],
            ].map(([k, l]) => (
              <Chip key={k} href={build({ sort: k })} active={filters.sort === k}>{l}</Chip>
            ))}
          </Row>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-6xl">🔍</div>
            <p className="mt-4 font-semibold">No products found</p>
            <Link href="/shop" className="btn-primary mt-6">Clear filters</Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-wider text-black/45">{label}</span>
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto">{children}</div>
    </div>
  );
}

function Chip({ href, active, children, tone }: { href: string; active: boolean; children: React.ReactNode; tone?: "red" }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold capitalize transition ${
        active
          ? tone === "red"
            ? "border-red-600 bg-red-600 text-white"
            : "border-ink bg-ink text-white"
          : tone === "red"
            ? "border-red-300 text-red-600 hover:border-red-600"
            : "border-black/10 hover:border-ink"
      }`}
    >
      {children}
    </Link>
  );
}
