import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import { and, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { ensureSeeded } from "./seed";

export type ProductFilters = {
  category?: string;
  style?: string;
  type?: string;
  q?: string;
  sale?: boolean;
  sort?: "newest" | "price-asc" | "price-desc";
};

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  await ensureSeeded();
  const conds: SQL[] = [];
  if (filters.category) conds.push(eq(products.category, filters.category));
  if (filters.style) conds.push(eq(products.style, filters.style));
  if (filters.type) conds.push(eq(products.type, filters.type));
  if (filters.sale) conds.push(eq(products.onSale, true));
  if (filters.q) {
    const term = `%${filters.q}%`;
    conds.push(or(ilike(products.name, term), ilike(products.description, term), ilike(products.type, term))!);
  }
  const order =
    filters.sort === "price-asc"
      ? sql`CASE WHEN ${products.onSale} THEN ${products.price} * (100 - ${products.discountPct}) / 100 ELSE ${products.price} END ASC`
      : filters.sort === "price-desc"
        ? sql`CASE WHEN ${products.onSale} THEN ${products.price} * (100 - ${products.discountPct}) / 100 ELSE ${products.price} END DESC`
        : desc(products.createdAt);

  return db
    .select()
    .from(products)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(order, desc(products.id));
}

export async function getFeaturedProducts() {
  await ensureSeeded();
  return db.select().from(products).where(eq(products.featured, true)).orderBy(desc(products.id)).limit(8);
}

export async function getSaleProducts() {
  await ensureSeeded();
  return db.select().from(products).where(eq(products.onSale, true)).orderBy(desc(products.discountPct)).limit(8);
}

export async function getNewArrivals() {
  await ensureSeeded();
  return db.select().from(products).where(eq(products.isNew, true)).orderBy(desc(products.id)).limit(8);
}

export async function getProductBySlug(slug: string) {
  await ensureSeeded();
  const [p] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return p ?? null;
}

export async function getProductById(id: number) {
  const [p] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return p ?? null;
}

export async function getRelated(product: Product) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.category, product.category), sql`${products.id} <> ${product.id}`))
    .limit(4);
}
